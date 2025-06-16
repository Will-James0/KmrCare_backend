from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from care.models import Dispensary
from api.enums.status import AppointmentStatus
import uuid


User = get_user_model()

def upload_to(instance, filename):
    return f"appointments/files/{instance.patient.id}/{instance.date}/{filename}"

class Appointment(models.Model):
    """
    Modèle pour représenter un rendez-vous.
    """
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='appointments')
    dispensary = models.ForeignKey(Dispensary, on_delete=models.CASCADE, related_name='appointments')
    date = models.DateTimeField()
    reason = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to=upload_to, blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=AppointmentStatus.choices,
        default=AppointmentStatus.PENDING
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    cancelled_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='cancelled_appointments')
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    

    def is_past_due(self):
        return self.date < timezone.now()

    def __str__(self):
        return f"RDV de {self.patient.username} le {self.date.strftime('%Y-%m-%d %H:%M')}"

