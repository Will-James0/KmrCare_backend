from django.db import models

class RoleEnum(models.TextChoices):
    CHIEF_DOCTOR = 'CHIEF_DOCTOR', 'medecin_chef'
    DOCTOR = 'DOCTOR', 'medecin'