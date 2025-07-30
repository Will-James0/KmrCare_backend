from rest_framework import serializers
from care.models import Dispensary
from care.serializers.doctor import UserPublicSerializer

class DispensarySerializer(serializers.ModelSerializer):
    owner = UserPublicSerializer(read_only=True)
    class Meta:
        model = Dispensary
        fields = ("owner", "name", "specialities", "quarter", "localisation", "phone", "email", "opening", "ending", "token")
        extra_kwargs = {
            "token": {"read_only": True}
        }
        

class UpdateDispensarySerializer(serializers.ModelSerializer):
    owner = UserPublicSerializer(read_only=True)
    owner_token = serializers.UUIDField(write_only=True, required=False)

    class Meta:
        model = Dispensary
        fields = (
            "owner", "owner_token",
            "name", "specialities", "quarter", "localisation",
            "phone", "email", "opening", "ending", "token"
        )
        extra_kwargs = {
            "name": {"allow_null": True, "required": False},
            "specialities": {"allow_null": True, "required": False},
            "quarter": {"allow_null": True, "required": False},
            "localisation": {"allow_null": True, "required": False},
            "phone": {"allow_null": True, "required": False},
            "email": {"allow_null": True, "required": False},
            "opening": {"allow_null": True, "required": False},
            "ending": {"allow_null": True, "required": False},
            "token": {"read_only": True}
        }
