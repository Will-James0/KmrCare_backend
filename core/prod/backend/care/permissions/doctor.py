from rest_framework.permissions import BasePermission
from care.models import Doctor
from care.enums.role import RoleEnum

class CanDeleteDoctor(BasePermission):
    """
    Autorise la suppression d’un médecin si :
    - le user est le propriétaire du dispensaire
    - ou un médecin chef du même dispensaire,
      mais uniquement si la cible n’est pas aussi médecin chef
    """

    def has_object_permission(self, request, view, obj):
        user = request.user

        # Vérification propriétaire du dispensaire
        if obj.dispensary and obj.dispensary.owner == user:
            return True

        # Vérifie si le user est médecin chef dans le même dispensaire
        try:
            actor = Doctor.objects.get(user=user, dispensary=obj.dispensary)
        except Doctor.DoesNotExist:
            return False
        
        # Si l'acteur n'est pas médecin chef → refus
        if not actor.role or actor.role.code != RoleEnum.CHIEF_DOCTOR:
            return False

        # Si la cible est aussi médecin chef → refus
        if obj.role and obj.role.code == RoleEnum.CHIEF_DOCTOR:
            return False

        # Médecin chef peut supprimer un médecin classique
        return True
    

class IsOwnerOrChiefDoctor(BasePermission):
    """
    Autorise l'accès si :
    - le user est le propriétaire du dispensaire
    - ou un médecin chef du même dispensaire
    """

    def has_object_permission(self, request, view, obj):
        user = request.user

        # Vérification propriétaire du dispensaire
        if obj.dispensary and obj.dispensary.owner == user:
            return True
        
        if obj.user == user:
            return True

        # Vérifie si le user est médecin chef dans le même dispensary
        try:
            actor = Doctor.objects.get(user=user, dispensary=obj.dispensary)
        except Doctor.DoesNotExist:
            return False
        
        # Si l'acteur n'est pas médecin chef → refus
        if not actor.role or actor.role.code != RoleEnum.CHIEF_DOCTOR:
            return False

        # Médecin chef peut accéder à tout médecin de son dispensaire
        return True
