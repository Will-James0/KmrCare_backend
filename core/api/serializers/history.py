from rest_framework import serializers
from api.models import AppointmentHistory
from django.contrib.auth import get_user_model

User = get_user_model()

class PublicUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'phone']


class AppointmentHistorySerializer(serializers.ModelSerializer):
    patient = PublicUserSerializer(read_only=True)
    dispensary = serializers.CharField(source="dispensary.name", read_only=True)
    cancelled_by = PublicUserSerializer(read_only=True)
    confirmed_by = PublicUserSerializer(read_only=True)
    rejected_by = PublicUserSerializer(read_only=True)

    class Meta:
        model = AppointmentHistory
        fields = [
            "patient", "dispensary", "date", "hour", "reason", "file", "token",
            "final_status", "completed_at", "cancelled_by",
            "confirmed_by", "rejected_by", "date_cancelled", "hour_cancelled",
            "observations"
        ]
        extra_kwargs = {
            "file": {"required": False, "allow_null": True},
            "completed_at": {"read_only": True},
            "token": {"read_only": True}
        }