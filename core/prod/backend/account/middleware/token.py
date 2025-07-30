from django.utils.deprecation import MiddlewareMixin
from rest_framework.authentication import get_authorization_header
from django.contrib.auth.models import AnonymousUser
from rest_framework.exceptions import AuthenticationFailed
from account.models import AuthToken

class AuthTokenMiddleware(MiddlewareMixin):
    def process_request(self, request):
        
        if request.path.startswith('/admin/'):
            return
        
        auth = get_authorization_header(request).split()
        if not auth or auth[0].lower() != b'bearer':
            request.user = AnonymousUser()
            return

        if len(auth) == 1 or len(auth) > 2:
            raise AuthenticationFailed("En-tête d’authentification invalide.")

        try:
            token_str = auth[1].decode()
            token = AuthToken.objects.get(key=token_str)
            if token.est_expire():
                token.delete()
                raise AuthenticationFailed("Token expiré.")
            request.user = token.user
        except AuthToken.DoesNotExist:
            raise AuthenticationFailed("Token invalide.")
