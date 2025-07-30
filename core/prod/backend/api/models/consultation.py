from django.db import models
from django.contrib.auth import get_user_model
from care.models import Dispensary
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()

def upload_to(instance, filename):
    return f"consultation/files/{instance.patient.id}/{instance.consultations.subject}/{filename}"

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    file = models.FileField(upload_to=upload_to, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    def __str__(self):
        return f"{self.sender.username}: {self.content[:20]}..."

class Consultation(models.Model):
    subject = models.CharField(max_length=255)
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='consultations', blank=True)
    messages = models.ManyToManyField(Message, blank=True, related_name='consultations')
    last_message = models.ForeignKey(Message, on_delete=models.SET_NULL, null=True, blank=True, related_name='last_message_consultations')
    dispensary = models.ForeignKey(Dispensary, on_delete=models.CASCADE, related_name='consultations')
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_consultations')

    def __str__(self):
        return f"Consultation: {self.subject} - {self.dispensary.name}"
    