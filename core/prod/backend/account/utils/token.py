from account.models import AuthToken
from django.utils import timezone
from datetime import timedelta

def create_fresh_token(user):
    # Supprime uniquement les tokens dont la validité restante est <= 1 heure
    one_hour_from_now = timezone.now() + timedelta(hours=1)

    AuthToken.objects.filter(
        user=user,
        validite__lte=one_hour_from_now
    ).delete()

    # Crée un nouveau token avec la bonne date de validité
    token, created = AuthToken.objects.get_or_create(user=user)
    return token
