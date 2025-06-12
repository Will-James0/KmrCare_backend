from rest_framework import serializers
from care.models import Doctor, Dispensary,Role
from django.db import transaction
from care.enums.role import RoleEnum  # pour valider le rôle
from django.contrib.auth import get_user_model

User = get_user_model()


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ("code", "label")
        extra_kwargs = {
            "code": {"read_only": True}, "name": {"read_only": True}
        }


class UserPublicSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ("first_name", "last_name", "username", "email", "image", "token")
        extra_kwargs = {
            "first_name": {"read_only": True}, "last_name": {"read_only": True},
            "username": {"read_only": True}, "email": {"read_only": True},
            "image": {"read_only": True}, "token": {"read_only": True}
        }
        
class DispensaryPublicSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Dispensary
        fields = ("name", "token")
        extra_kwargs = {
            "name": {"read_only":True}, "token":{"read_only":True}
        }


class AddDoctorSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField()
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    role = serializers.CharField()

    def validate_role(self, value):
        if not Role.objects.filter(code=value).exists():
            raise serializers.ValidationError("Rôle invalide.")
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Ce nom d'utilisateur existe déjà.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Cet e-mail existe déjà.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        role_code = validated_data.pop("role")
        role = Role.objects.get(code=role_code)
        dispensary = self.context["dispensary"]

        user = User.objects.create_user(**validated_data)
        # (create_user gère le hash du mot de passe)

        doctor = Doctor.objects.create(
            user=user,
            dispensary=dispensary,
            role=role
        )
        return doctor
    
class DoctorSerializer(serializers.ModelSerializer):
    user = UserPublicSerializer(read_only=True)
    role = RoleSerializer(read_only=True)
    dispensary = serializers.CharField(source='dispensary.name', read_only=True)
    
    class Meta:
        model = Doctor
        fields = ("user", "dispensary", "role", "token")
        extra_kwargs = {
            "token": {"read_only": True}
        }
    