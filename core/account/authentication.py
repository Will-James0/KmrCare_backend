from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.utils import timezone
from .models import AuthToken

class AuthTokenAuthentication(TokenAuthentication):
    keyword = 'Bearer'
    model = AuthToken

    def authenticate_credentials(self, key):
        try:
            token = self.model.objects.select_related('user').get(key=key)
        except self.model.DoesNotExist:
            raise AuthenticationFailed('Token invalide')

        # Vérification de l'expiration
        if token.est_expire():
            raise AuthenticationFailed('Token expiré')

        if not token.user.is_active:
            raise AuthenticationFailed('Utilisateur inactif')

        return (token.user, token)