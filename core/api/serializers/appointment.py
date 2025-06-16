from rest_framework import serializers
from api.models import Appointment, AppointmentHistory


class AppointmentSerializer(serializers.ModelSerializer):
    patient = serializers.CharField(source="patient.username", read_only=True)
    dispensary = serializers.CharField(source="dispensary.name", read_only=True)
    cancelled_by = serializers.CharField(source="cancelled_by.username", read_only=True)
    
    class Meta:
        model = Appointment
        fields = ["patient", "dispensary", "date", "reason", "file", "status", "created_at", "updated_at", "cancelled_by", "token"]
        extra_kwargs = {
            "created_at": {"read_only": True}, "updated_at": {"read_only": True},
            "token": {"read_only": True}
        }
        

class UpdateAppointmentSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Appointment
        