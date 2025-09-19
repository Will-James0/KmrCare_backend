from rest_framework import serializers
from api.models import AppointmentHistory
<<<<<<< HEAD


class AppointmentHistorySerializer(serializers.ModelSerializer):
    patient = serializers.CharField(source="patient.username", read_only=True)
    dispensary = serializers.CharField(source="dispensary.name", read_only=True)
    cancelled_by = serializers.CharField(source="cancelled_by.username", read_only=True)
    confirmed_by = serializers.CharField(source="confirmed_by.username", read_only=True)
    rejected_by = serializers.CharField(source="rejected_by.username", read_only=True)
=======
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
>>>>>>> 7ed5c49a05dbf8c7f07c9e1dd2d2fe11dea0e280

    class Meta:
        model = AppointmentHistory
        fields = [
<<<<<<< HEAD
            "patient", "dispensary", "date", "hour", "reason", "file",
            "created_at", "updated_at", "token",
            "final_status", "completed_at", "cancelled_by",
            "confirmed_by", "rejected_by", "date_cancelled", "hour_cancelled"
        ]
        extra_kwargs = {
            "file": {"allow_blank": True, "allow_null": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
=======
            "patient", "dispensary", "date", "hour", "reason", "file", "token",
            "final_status", "completed_at", "cancelled_by",
            "confirmed_by", "rejected_by", "date_cancelled", "hour_cancelled",
            "observations"
        ]
        extra_kwargs = {
            "file": {"required": False, "allow_null": True},
            "completed_at": {"read_only": True},
>>>>>>> 7ed5c49a05dbf8c7f07c9e1dd2d2fe11dea0e280
            "token": {"read_only": True}
        }