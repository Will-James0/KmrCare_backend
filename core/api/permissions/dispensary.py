from rest_framework.permissions import BasePermission

class IsDispensaryMember(BasePermission):
    """
    Autorise l’accès si l’utilisateur est membre du dispensaire.
    """

    def has_permission(self, request, view, obj):
        return obj.dispensary.owner == request.user or \
            obj.dispensary.doctors.filter(user=request.user).exists()