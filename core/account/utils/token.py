from account.models import AuthToken

def create_fresh_token(user):
    # Supprime tous les anciens tokens (expirés ou pas)
    AuthToken.objects.filter(user=user).delete()
    # Crée un nouveau token avec la bonne date de validité
    return AuthToken.objects.create(user=user)
