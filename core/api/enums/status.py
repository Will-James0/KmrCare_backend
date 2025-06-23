from django.db import models

class AppointmentStatus(models.TextChoices):
    PENDING = 'PENDING', 'En attente'
    CONFIRMED = 'CONFIRMED', 'Confirmé'
    IN_PROGRESS = 'IN_PROGRESS', 'En cours'
    CANCELLED = 'CANCELLED', 'Annulé'
    REJECTED = 'REJECTED', 'Rejeté'
    PENDING_MODIFICATION = "PENDING_MODIFICATION", "En attente de modification"
    COMPLETED = "COMPLETED", "Terminé"