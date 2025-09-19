from rest_framework import serializers
from api.models import AppointmentHistory


class AppointmentHistorySerializer(serializers.ModelSerializer):
    patient = serializers.CharField(source="patient.username", read_only=True)
    dispensary = serializers.CharField(source="dispensary.name", read_only=True)
    cancelled_by = serializers.CharField(source="cancelled_by.username", read_only=True)
    confirmed_by = serializers.CharField(source="confirmed_by.username", read_only=True)
    rejected_by = serializers.CharField(source="rejected_by.username", read_only=True)

    class Meta:
        model = AppointmentHistory
        fields = [
            "patient", "dispensary", "date", "hour", "reason", "file",
            "created_at", "updated_at", "token",
            "final_status", "completed_at", "cancelled_by",
            "confirmed_by", "rejected_by", "date_cancelled", "hour_cancelled"
        ]
        extra_kwargs = {
            "file": {"allow_blank": True, "allow_null": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
            "token": {"read_only": True}
        }