from rest_framework.authtoken.views import ObtainAuthToken
from account.models import AuthToken, User
from rest_framework.response import Response
from care.models import Dispensary, Doctor
from rest_framework import status
from account.utils import create_fresh_token

class LoginAPIView(ObtainAuthToken):
    
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
            'username': user.username,
            'token': user.token 
        }
        return Response(data)
    
class DoctorLoginAPIView(ObtainAuthToken):
    
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
                'token': user.token,
                'is_doctor': True,
                'is_owner': True if Dispensary.objects.filter(owner=user).exists() else False
            }
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Vous n'êtes pas autorisé à vous connecter en tant que médecin."}, status=status.HTTP_403_FORBIDDEN)


class AdminLoginAPIView(ObtainAuthToken):
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
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
                'token': user.token,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser
            }
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Vous n'êtes pas autorisé à vous connecter en tant qu'administrateur."}, status=status.HTTP_403_FORBIDDEN)
            
        
        