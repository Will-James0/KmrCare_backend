# signals.py
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from care.models.role import Role
from care.enums.role import RoleEnum

@receiver(post_migrate)
def create_roles(sender, **kwargs):
    for role in RoleEnum:
        Role.objects.get_or_create(code=role.value, defaults={'label': role.label})
