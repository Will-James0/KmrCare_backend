from rest_framework import serializers
from api.models import Appointment, AppointmentHistory
from care.serializers import UserPublicSerializer, DispensaryPublicSerializer
from api.validators import validate_hour_within_dispensary, validate_modification_timing

class AppointmentSerializer(serializers.ModelSerializer):
    patient = serializers.CharField(source="patient.username", read_only=True)
    dispensary = serializers.CharField(source="dispensary.name", read_only=True)
    cancelled_by = serializers.CharField(source="cancelled_by.username", read_only=True)
    
    class Meta:
        model = Appointment
        fields = ["patient", "dispensary", "date", "hour", "reason", "file", "created_at", "updated_at", "cancelled_by", "token"]
        extra_kwargs = {
            "file": {"allow_blank": True, "allow_null": True},
            "created_at": {"read_only": True}, "updated_at": {"read_only": True},
            "token": {"read_only": True}
        }
        

class UpdateAppointmentSerializer(serializers.ModelSerializer):
    patient = UserPublicSerializer(read_only=True)

    class Meta:
        model = Appointment
        fields = ["patient", "date", "hour", "reason", "file", "status"]
        extra_kwargs = {
            "date": {"allow_blank": True, "allow_null": True},
            "hour": {"allow_blank": True, "allow_null": True},
            "reason": {"allow_null": True, "allow_blank": True},
            "file": {"allow_blank": True, "allow_null": True},
            "status": {"read_only": True},
        }

    def validate(self, attrs):
        attrs = validate_hour_within_dispensary(attrs, self.instance)
        attrs = validate_modification_timing(attrs, self.instance)
        return attrs
        
        
class CreateAppointmentSerializer(serializers.ModelSerializer):
    patient = UserPublicSerializer(read_only=True)
    dispensary = DispensaryPublicSerializer(read_only=True)
    dispensary_token = serializers.UUIDField(write_only=True, required=False, allow_null=True)
    
    class Meta:
        model = Appointment
        fields = ["patient", "dispensary", "dispensary_token", "date", "hour", "reason", "file"]
        extra_kwargs = {
            "file": {"allow_blank": True, "allow_null": True},
        }
        
        
    def validate(self, attrs):
        return validate_hour_within_dispensary(attrs)