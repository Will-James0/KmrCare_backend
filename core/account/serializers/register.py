from rest_framework import serializers
from account.models import WaitingUser
from django.contrib.auth import get_user_model

User = get_user_model()



class RegisterUserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ("first_name", "last_name", "email", "username", "password")
        

class WaitingUserSerializer(serializers.ModelSerializer):
    
    
    class Meta:
        model = WaitingUser
        fields = [
            "first_name", "last_name", "email", "username", "password",
            "dispensary_name", "dispensary_specialities", "dispensary_quarter", "dispensary_localisation",
            "dispensary_phone", "dispensary_email", "dispensary_opening", "dispensary_ending", "token"
        ]
        extra_kwargs = {
            "password": {"write_only": True},
            "dispensary_phone": {"allow_null": True, "required": False, "allow_blank": True},
            "dispensary_email": {"allow_null": True, "required": False, "allow_blank": True},
            "token": {"read_only": True}
        }
    
    
class RegisterAdminSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ("first_name", "last_name", "email", "username", "password", "is_staff", "is_superuser")
        extra_kwargs = {
            "is_superuser": {"allow_null": True, "allow_blank": True}
        }