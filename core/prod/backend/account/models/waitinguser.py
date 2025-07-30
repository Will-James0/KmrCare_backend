from typing import override
from django.db import models
import uuid


class WaitingUser(models.Model):
    first_name = models.CharField(max_length=150, blank=True, null=True)
    last_name = models.CharField(max_length=150, blank=True, null=True)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128)
    phone = models.CharField(max_length=15, null=True, blank=True)
    dispensary_name = models.CharField(max_length=255, unique=True)
    dispensary_specialities = models.TextField()
    dispensary_quarter = models.CharField(max_length=255)
    dispensary_localisation = models.TextField()
    dispensary_phone = models.CharField(max_length=50, null=True)
    dispensary_email = models.EmailField(null=True, blank=True)
    dispensary_opening = models.TimeField()
    dispensary_ending = models.TimeField()
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    logo = models.ImageField(upload_to='waiting_user_logos/', null=True, blank=True)
    
    def __str__(self):
        return f"{self.username} - {self.dispensary_name}"
    
    
    