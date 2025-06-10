from django.utils import timezone
from django.db import models
from rest_framework.authtoken.models import Token

class AuthToken(Token):
    validite = models.DateTimeField(verbose_name="Date d'expiration", blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.validite:
            self.validite = timezone.now() + timezone.timedelta(hours=12)
        super().save(*args, **kwargs)

    def est_expire(self):
        if self.validite and timezone.now() >= self.validite:
            self.delete()
            return True
        return False

    def __str__(self):
        return f"{self.user} - Expire le {self.validite}"
