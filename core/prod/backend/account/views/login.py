from rest_framework.authtoken.views import ObtainAuthToken
from account.models import AuthToken, User
from rest_framework.response import Response
from care.models import Dispensary, Doctor
from rest_framework import status
from account.utils import create_fresh_token
from account.serializers.login import CustomAuthTokenSerializer
import logging

# Configuration du logger
logger = logging.getLogger(__name__)

class LoginAPIView(ObtainAuthToken):
    """
    Vue de connexion personnalisée qui permet l'authentification
    avec le nom d'utilisateur ou l'email
    """
    serializer_class = CustomAuthTokenSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token = create_fresh_token(user)

        data = {}
        data["token"] = {
            'key': token.key,
            'validite': token.validite,
            'token_exp': int(token.validite.timestamp() * 1000)
        }
        data["user"] = {
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'phone': user.phone,
            'username': user.username,
            'token': user.token 
        }
        return Response(data)
    
class DoctorLoginAPIView(ObtainAuthToken):
    """
    Vue de connexion pour les docteurs qui permet l'authentification
    avec le nom d'utilisateur ou l'email
    """
    serializer_class = CustomAuthTokenSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        data = {}
        if Doctor.objects.filter(user=user).exists() or Dispensary.objects.filter(owner=user).exists():
            token = create_fresh_token(user)

            data["token"] = {
                'key': token.key,
                'validite': token.validite,
                'token_exp': int(token.validite.timestamp() * 1000)
            }
            data["user"] = {
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'username': user.username,
                'phone': user.phone,
                'token': user.token,
                'is_doctor': True,
                'is_owner': True if Dispensary.objects.filter(owner=user).exists() else False
            }
            
            dispensary = Dispensary.objects.get(owner=user) or Doctor.objects.get(user=user).dispensary
            
            data["dispensary"] = {
                "dispensary_name": dispensary.name,
                "dispensary_logo": request.build_absolute_uri(dispensary.logo.url) if dispensary.logo else None,
                "dispensary_token": dispensary.token,
            }
            
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Vous n'êtes pas autorisé à vous connecter en tant que médecin."}, status=status.HTTP_403_FORBIDDEN)


class AdminLoginAPIView(ObtainAuthToken):
    """
    Vue de connexion pour les administrateurs qui permet l'authentification
    avec le nom d'utilisateur ou l'email
    """
    serializer_class = CustomAuthTokenSerializer
    
    def post(self, request, *args, **kwargs):
        logger.info(f"Tentative de connexion admin avec: {request.data.get('username', 'N/A')}")
        
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data['user']
            
            # Log des informations de l'utilisateur pour debug
            logger.info(f"Utilisateur authentifié: {user.username}")
            logger.info(f"is_staff: {user.is_staff}")
            logger.info(f"is_superuser: {user.is_superuser}")
            logger.info(f"is_active: {user.is_active}")
            
            data = {}
            if user.is_superuser or user.is_staff:
                token = create_fresh_token(user)

                data["token"] = {
                    'key': token.key,
                    'validite': token.validite,
                    'token_exp': int(token.validite.timestamp() * 1000)
                }
                data["user"] = {
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'email': user.email,
                    'username': user.username,
                    'phone': user.phone,
                    'token': user.token,
                    'is_staff': user.is_staff,
                    'is_superuser': user.is_superuser
                }
                logger.info(f"Connexion admin réussie pour: {user.username}")
                return Response(data, status=status.HTTP_200_OK)
            else:
                logger.warning(f"Accès refusé pour {user.username} - Pas de permissions d'admin (is_staff: {user.is_staff}, is_superuser: {user.is_superuser})")
                return Response({
                    "message": "Vous n'êtes pas autorisé à vous connecter en tant qu'administrateur.",
                    "details": f"Permissions actuelles: is_staff={user.is_staff}, is_superuser={user.is_superuser}"
                }, status=status.HTTP_403_FORBIDDEN)
                
        except Exception as e:
            logger.error(f"Erreur lors de la connexion admin: {str(e)}")
            return Response({
                "message": "Une erreur est survenue lors de la connexion",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        
        