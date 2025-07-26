from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from account.authentication import AuthTokenAuthentication
from rest_framework import status
from rest_framework import generics
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from account.serializers.user import UserSerializer, UserUpdateSerializer

User = get_user_model()

class ListUsersView(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [AuthTokenAuthentication]
    serializer_class = UserSerializer
    queryset = User.objects.all()
    
class UserDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [AuthTokenAuthentication]
    serializer_class = UserSerializer
    queryset = User.objects.all()
    lookup_field = 'token'
    
    
class UpdateUserView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [AuthTokenAuthentication]
    serializer_class = UserUpdateSerializer
    queryset = User.objects.all()
    lookup_field = 'token'
    
    
class DeleteUserView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [AuthTokenAuthentication]
    serializer_class = UserSerializer
    queryset = User.objects.all()
    lookup_field = 'token'
    
    def perform_destroy(self, instance):
        instance.image.delete()
        return super().perform_destroy(instance)
    
