from rest_framework import serializers
from care.models import Dispensary
from api.enums import AppointmentStatus
from datetime import datetime, timedelta
from django.utils import timezone
from django.shortcuts import get_object_or_404

def validate_hour_within_dispensary(attrs):
    hour = attrs.get("hour")
    dispensary_token = attrs.get("dispensary_token")

    if hour and dispensary_token:
        try:
            dispensary = get_object_or_404(Dispensary, token = dispensary_token)
        except Dispensary.DoesNotExist:
            raise serializers.ValidationError({"dispensary_token": "Dispensaire introuvable."})

        if not (dispensary.opening <= hour <= dispensary.ending):
            raise serializers.ValidationError({
                "hour": f"L'heure {hour} est hors des horaires d'ouverture ({dispensary.opening} - {dispensary.ending})."
            })

    return attrs


def validate_modification_timing(attrs, instance):
    if not instance:
        return attrs

    status = instance.status
    excluded_statuses = [
        AppointmentStatus.REJECTED,
        AppointmentStatus.CANCELLED,
        AppointmentStatus.IN_PROGRESS,
    ]

    if status in excluded_statuses:
        raise serializers.ValidationError("Ce rendez-vous ne peut plus être modifié.")

    appointment_datetime = datetime.combine(instance.date, instance.hour)
    appointment_datetime = timezone.make_aware(appointment_datetime)
    limit = appointment_datetime - timedelta(hours=48)

    if timezone.now() > limit:
        raise serializers.ValidationError("Les modifications sont interdites à moins de 48 heures du rendez-vous.")

    return attrs