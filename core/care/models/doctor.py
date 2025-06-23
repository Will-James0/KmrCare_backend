from django.db import models
from .dispensary import Dispensary
from .role import Role
import uuid
from django.contrib.auth import get_user_model

User = get_user_model()



class Doctor(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    dispensary = models.ForeignKey(Dispensary, on_delete=models.SET_NULL, null=True, related_name='doctors')
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True)
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    
    def __str__(self):
        return f"Doctor {self.user.username} at {self.dispensary.name if self.dispensary else 'No Dispensary'}"