from typing import override
from django.apps import AppConfig


class CareConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'care'
    
    def ready(self):
        import care.signals
