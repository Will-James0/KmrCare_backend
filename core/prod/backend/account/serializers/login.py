from rest_framework import serializers
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from account.models import User

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

class CustomAuthTokenSerializer(serializers.Serializer):
    """
    Sérializeur personnalisé pour l'authentification par token
    Permet de se connecter avec le nom d'utilisateur ou l'email
    """
    username = serializers.CharField(
        label=_("Username/Email"),
        write_only=True,
        help_text=_("Nom d'utilisateur ou adresse email")
    )
    password = serializers.CharField(
        label=_("Password"),
        style={'input_type': 'password'},
        trim_whitespace=False,
        write_only=True
    )
    token = serializers.CharField(
        label=_("Token"),
        read_only=True
    )

    def validate(self, attrs):
        username_or_email = attrs.get('username')
        password = attrs.get('password')

        if username_or_email and password:
            # D'abord, essayer avec le nom d'utilisateur
            user = authenticate(request=self.context.get('request'),
                              username=username_or_email, password=password)
            
            # Si l'authentification échoue, essayer avec l'email
            if not user:
                try:
                    # Rechercher l'utilisateur par email
                    user_obj = User.objects.get(email=username_or_email)
                    # Authentifier avec le nom d'utilisateur réel
                    user = authenticate(request=self.context.get('request'),
                                      username=user_obj.username, password=password)
                except User.DoesNotExist:
                    pass

            # Si l'authentification échoue encore, lever une erreur
            if not user:
                msg = _('Unable to log in with provided credentials.')
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = _('Must include "username" and "password".')
            raise serializers.ValidationError(msg, code='authorization')

        attrs['user'] = user
        return attrs