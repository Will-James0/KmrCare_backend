from rest_framework import serializers
from api.models import Consultation
from care.serializers import UserPublicSerializer, DispensaryPublicSerializer

class ConsultationSerializer(serializers.ModelSerializer):
    patient = UserPublicSerializer(read_only=True)
    dispensary = DispensaryPublicSerializer(read_only=True)
    created_by = UserPublicSerializer(read_only=True)
    patient_token = serializers.UUIDField(write_only=True)
    dispensary_token = serializers.UUIDField(write_only=True)
    
    class Meta:
        model = Consultation
        fields = [
            "token", "subject", "patient", "dispensary", "created_by",
            "patient_token", "dispensary_token", "created_at", "updated_at"
        ]
        extra_kwargs = {
            "token": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True}
        }