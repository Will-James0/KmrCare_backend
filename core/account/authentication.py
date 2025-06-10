from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed
from account.models.token import AuthToken


class AuthTokenAuthentication(TokenAuthentication):
    keyword = 'Bearer'
    model = AuthToken

    # def authenticate_credentials(self, key):
    #     try:
    #         token = self.get_model().objects.select_related('user').get(key=key)
    #     except self.get_model().DoesNotExist:
    #         raise AuthenticationFailed('Token invalide.')

    #     if token.est_expire():
    #         raise AuthenticationFailed('Le token a expiré. Veuillez vous reconnecter.')

    #     if not token.user.is_active:
    #         raise AuthenticationFailed('Utilisateur inactif ou supprimé.')

    #     return (token.user, token)