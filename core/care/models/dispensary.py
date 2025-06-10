from django.db import models
import uuid
from django.contrib.auth import get_user_model

User = get_user_model()


class Dispensary(models.Model):
    owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="owned_dispensaries")
    name = models.CharField(max_length=255, unique=True)
    specialities = models.TextField()
    quarter = models.CharField(max_length=255)
    localisation = models.TextField()
    phone = models.CharField(max_length=50, null=True)
    email = models.EmailField(null=True)
    opening = models.TimeField()
    ending = models.TimeField()
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    
    def __str__(self):
        return f"Dispensaire {self.name}"
    
    