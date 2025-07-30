from rest_framework import serializers
from django.contrib.auth import get_user_model
from care.models import Doctor, Dispensary

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    is_doctor = serializers.SerializerMethodField(read_only=True)
    is_owner = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'username', 'is_staff', 'is_superuser', 'token', 'is_active', 'phone', 'token', 'is_doctor', 'is_owner', "last_login", "date_joined"]
        
    def get_is_doctor(self, obj):
        return Doctor.objects.filter(user=obj).exists()
    
    def get_is_owner(self, obj):
        return Dispensary.objects.filter(owner=obj).exists()


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
            'is_staff': {'allow_null': True},
            'is_superuser': {'allow_null': True},
            'is_active': {'allow_null': True},
        }
        
        
class UserRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['is_staff', 'is_superuser', 'is_active']
        extra_kwargs = {
            'is_staff': {'required': False},
            'is_superuser': {'required': False},
            'is_active': {'required': False}
        }