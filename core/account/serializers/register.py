from rest_framework import serializers
from account.models import WaitingUser
from django.contrib.auth import get_user_model

User = get_user_model()



class RegisterUserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ("first_name", "last_name", "email", "username", "password", "phone", "is_staff", "is_superuser")
        

class WaitingUserSerializer(serializers.ModelSerializer):
    
    
    class Meta:
        model = WaitingUser
        fields = [
            "first_name", "last_name", "email", "username", "password",
            "dispensary_name", "dispensary_specialities", "dispensary_quarter", "dispensary_localisation",
            "dispensary_phone", "dispensary_email", "dispensary_opening", "dispensary_ending", "token", "phone", "logo"
        ]
        extra_kwargs = {
            "password": {"write_only": True},
            "dispensary_phone": {"allow_null": True, "required": False, "allow_blank": True},
            "dispensary_email": {"allow_null": True, "required": False, "allow_blank": True},
            "token": {"read_only": True},
            "phone": {"allow_null": True, "required": False, "allow_blank": True},
        }
        
    def validate_email(self, value):
        if User.objects.filter(email=value).exists() or WaitingUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Cet email est déjà utilisé.")
        return value
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists() or WaitingUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("Ce nom d'utilisateur est déjà utilisé.")
        return value
    
    
class RegisterAdminSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ("first_name", "last_name", "email", "username", "password", "is_staff", "is_superuser", "phone")
        extra_kwargs = {
            "is_superuser": {"allow_null": True, "allow_blank": True}
        }