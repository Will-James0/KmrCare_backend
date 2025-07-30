import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from api.models import Consultation, Message
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from care.models import Doctor
from account.models import AuthToken

User = get_user_model()


class ConsultationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_token = self.scope['url_route']['kwargs']['token']
        self.room_group_name = f'consultation_{self.room_token}'
        
        # Authentification et vérification d'accès
        user = await self.authenticate_user()
        if not user:
            await self.close(code=4003)  # Code d'erreur pour authentification échouée
            return
            
        has_access = await self.check_consultation_access(user, self.room_token)
        if not has_access:
            await self.close(code=4004)  # Code d'erreur pour accès refusé
            return
            
        self.user = user

        await self.accept()

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        messages = await self.get_messages()

        await self.send(text_data=json.dumps({
            'type': 'consultation_history',
            'messages': messages
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        file_data = data.get('file', None)

        # Utiliser l'utilisateur authentifié lors de la connexion
        user = self.user
        consultation = await self.get_consultation_by_token(self.room_token)

        await self.save_message(user, consultation, message, file_data)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'consultation_message',
                'message': message,
                'username': user.username,
                'user_token': str(user.token),
                'timestamp': None,  # Will be set in the handler
                'file': file_data
            }
        )

    async def consultation_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'consultation_message',
            'message': event['message'],
            'username': event['username'],
            'user_token': event['user_token'],
            'timestamp': event.get('timestamp'),
            'file': event.get('file')
        }))

    @database_sync_to_async
    def authenticate_user(self):
        """
        Authentifie l'utilisateur via le token dans les query parameters ou headers
        """
        # Récupération du token depuis les query parameters
        query_string = self.scope.get('query_string', b'').decode()
        token = None
        
        if query_string:
            params = dict(param.split('=') for param in query_string.split('&') if '=' in param)
            token = params.get('token')
        
        if not token:
            # Essayer depuis les headers
            for name, value in self.scope.get('headers', []):
                if name == b'authorization':
                    auth_header = value.decode()
                    if auth_header.startswith('Bearer '):
                        token = auth_header[7:]
                        break
        
        if not token:
            return None
            
        try:
            auth_token = AuthToken.objects.select_related('user').get(key=token)
            if auth_token.est_expire():
                auth_token.delete()
                return None
            return auth_token.user
        except AuthToken.DoesNotExist:
            return None

    @database_sync_to_async
    def check_consultation_access(self, user, consultation_token):
        """
        Vérifie si l'utilisateur a accès à cette consultation :
        - Propriétaire du dispensaire
        - Médecin du dispensaire
        - Patient de la consultation
        """
        try:
            consultation = Consultation.objects.select_related('dispensary', 'patient').get(token=consultation_token)
            
            # 1. Vérifier si c'est le propriétaire du dispensaire
            if consultation.dispensary.owner == user:
                return True
            
            # 2. Vérifier si c'est un médecin du dispensaire
            if consultation.dispensary.doctors.filter(user=user).exists():
                return True
            
            # 3. Vérifier si c'est le patient de la consultation
            if consultation.patient == user:
                return True
                
            return False
            
        except Consultation.DoesNotExist:
            return False

    @database_sync_to_async
    def get_user_by_token(self, token):
        return get_object_or_404(User, token=token)

    @database_sync_to_async
    def get_consultation_by_token(self, token):
        return get_object_or_404(Consultation, token=token)

    @database_sync_to_async
    def save_message(self, user, consultation, message_content, file_data=None):
        msg = Message.objects.create(
            sender=user, 
            content=message_content,
            file=file_data if file_data else None
        )
        consultation.messages.add(msg)
        consultation.last_message = msg
        consultation.save()

    @database_sync_to_async
    def get_messages(self):
        consultation = get_object_or_404(Consultation, token=self.room_token)
        messages = consultation.messages.all().order_by('timestamp')
        return [
            {
                'id': msg.id,
                'username': msg.sender.username,
                'user_token': str(msg.sender.token),
                'timestamp': msg.timestamp.isoformat(),
                'content': msg.content,
                'file': msg.file.url if msg.file else None
            } for msg in messages
        ]