from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from care.models import Dispensary
from api.enums.status import AppointmentStatus
import uuid


User = get_user_model()

def upload_to(instance, filename):
    return f"appointments/files/{instance.patient.id}/{instance.date}/{filename}"

class AppointmentHistory(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE)
    dispensary = models.ForeignKey(Dispensary, on_delete=models.SET_NULL, null=True)
    date = models.DateField()
    hour = models.TimeField()
    reason = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to=upload_to, blank=True, null=True)
    final_status = models.CharField(max_length=20, choices=AppointmentStatus.choices)
    completed_at = models.DateTimeField(auto_now_add=True)
    confirmed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='confirmed_history')
    rejected_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='rejected_history')
    date_cancelled = models.DateTimeField(null=True, blank=True)
    hour_cancelled = models.TimeField(null=True, blank=True)
    cancelled_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='cancelled_history')
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    def __str__(self):
        return f"Historique - {self.patient.username} ({self.final_status}) le {self.date.strftime('%Y-%m-%d')}"
