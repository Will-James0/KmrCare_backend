from rest_framework import serializers
from account.models.user import User


class ProfileSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ("first_name", "last_name", "email", "username", "password", "image", "token", "phone")
        extra_kwargs = {
            "first_name": {"allow_null": True, "allow_blank": True},
            "last_name": {"allow_null": True, "allow_blank": True},
            "email": {"allow_null": True, "allow_blank": True},
            "username": {"allow_null": True, "allow_blank": True},
            "password": {"write_only": True, "allow_null": True, "allow_blank": True},
            "image": {"allow_null": True, "allow_blank": True},
            "phone": {"allow_null": True, "allow_blank": True},
            "token": {"read_only": True}
        }