from rest_framework.permissions import BasePermission

class IsDispensaryMember(BasePermission):
    """
    Autorise l’accès si l’utilisateur est membre du dispensaire.
    """

    def has_permission(self, request, view):
        # Ici, tu peux vérifier des droits globaux si besoin
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Vérifie si l'utilisateur est propriétaire ou médecin du dispensaire
        return (
            obj.dispensary.owner == request.user or
            obj.dispensary.doctors.filter(user=request.user).exists()
        )