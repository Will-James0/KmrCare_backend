from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from account.serializers import register
from account.models import WaitingUser
from care.models import Dispensary
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model

User = get_user_model()


class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = register.RegisterUserSerializer
    
    def perform_create(self, serializer):
        mdp = serializer.validated_data.get("password")
        password = make_password(mdp)
        serializer.save(password = password)
        
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({
            "message": "Compte créé avec succès !",
        }, status=status.HTTP_201_CREATED)
        

class RegisterOwnerView(generics.ListCreateAPIView):
    queryset = WaitingUser.objects.all()
    serializer_class = register.WaitingUserSerializer
    
    def perform_create(self, serializer):
        mdp = serializer.validated_data.get("password")
        password = make_password(mdp)
        serializer.save(password = password)
        
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({
            "message": "Demande envoyée avec succès !",
        }, status=status.HTTP_201_CREATED)
        
class ApproveRegisterView(APIView):
    """
    Approuver la demande
    """
    
    def post(self, request, token):
        try:
            waiting = get_object_or_404(WaitingUser, token=token)
            user = User(
                username = waiting.username,
                password = waiting.password,
                first_name = waiting.first_name,
                last_name = waiting.last_name,
                email = waiting.email
            )
            user.save()
            dispensary = Dispensary(
                owner = user,
                name = waiting.dispensary_name,
                specialities = waiting.dispensary_specialities,
                quarter = waiting.dispensary_quarter,
                localisation = waiting.dispensary_localisation,
                phone = waiting.dispensary_phone,
                email = waiting.email,
                opening = waiting.dispensary_opening,
                ending = waiting.dispensary_ending
            )
            dispensary.save()
            waiting.delete()
            return Response({"message": "Inscription approuvée !"}, status=status.HTTP_200_OK)
        except WaitingUser.DoesNotExist:
            return Response({"message": "Iscription introuvable !"}, status=status.HTTP_404_NOT_FOUND)


class RefuseRegisterView(APIView):
    """
    View pour refuser un utilisateur de la file d'attente
    """
    
    def post(self, reuest, token):
        try:
            waiting = get_object_or_404(WaitingUser, token=token)
            waiting.delete()
            return Response({"message": "Incription rejetée"}, status=status.HTTP_200_OK)
        except WaitingUser.DoesNotExist:
            return Response({"message": "Iscription introuvable !"}, status=status.HTTP_404_NOT_FOUND)
        
        
class RegisterAdminView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = register.RegisterUserSerializer
    
    def perform_create(self, serializer):
        mdp = serializer.validated_data.get("password")
        password = make_password(mdp)
        staff = True
        serializer.save(password = password, is_staff = staff)
        
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({
            "message": "Compte créé avec succès !",
        }, status=status.HTTP_201_CREATED)
        