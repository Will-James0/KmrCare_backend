from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'username', 'is_staff', 'is_superuser', 'token', 'is_active', 'phone', 'token']
        
        
class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'username', 'password', 'is_staff', 'is_superuser', 'token', 'is_active', 'phone']
        extra_kwargs = {
            'first_name': {'allow_null': True, 'allow_blank': True},
            'last_name': {'allow_null': True, 'allow_blank': True},
            'email': {'allow_null': True, 'allow_blank': True},
            'username': {'allow_null': True, 'allow_blank': True},
            'password': {'write_only': True, 'allow_null': True, 'allow_blank': True},
            'phone': {'allow_null': True, 'allow_blank': True},
            'token': {'read_only': True},
            'is_staff': {'allow_null': True, 'allow_blank': True},
            'is_superuser': {'allow_null': True, 'allow_blank': True},
            'is_active': {'allow_null': True, 'allow_blank': True},
        }