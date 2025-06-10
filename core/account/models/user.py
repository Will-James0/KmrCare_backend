from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid


class User(AbstractUser):
    image = models.ImageField(upload_to="User/images", null=True, blank=True)
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    
    def __str__(self):
        return f"{self.username}"