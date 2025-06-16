from rest_framework.permissions import BasePermission
from care.models import Doctor, Dispensary
from care.enums.role import RoleEnum
from account.models import AuthToken

class IsOwner(BasePermission):
    """
    Autorise l'accès uniquement si l'utilisateur est le propriétaire du dispensaire.
    """

    def has_object_permission(self, request, view, obj):
        # obj ici est une instance de Dispensary
        return obj.owner == request.user
    
    
class IsOwnerOrAdmin(BasePermission):
    """
    L'utilisateur doit être le propriétaire de l'objet OU un admin.
    """
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user or request.user.is_staff

    

class IsOwnerOrChiefDoctor(BasePermission):
    def has_permission(self, request, view):
        # Vue "collection" : on exige d’être owner ou chief de ce dispensaire (token dans l’URL)
        token = view.kwargs.get("token")
        if not token:
            return False

        try:
            
            dispensary = Dispensary.objects.get(token=token)
        except Dispensary.DoesNotExist:
            return False

        user = request.user
        if dispensary.owner == user:
            return True

        return Doctor.objects.filter(
            user=user,
            dispensary=dispensary,
            role__code=RoleEnum.CHIEF_DOCTOR
        ).exists()
        
        
# class IsDispensaryMember(BasePermission):
#     """
#     Autorise l’accès si :
#       • l’utilisateur est membre du dispensaire
#     """

#     def has_object_permission(self, request, view, obj):
#         user = request.user

#         # 1) Propriétaire ?
#         if obj.owner == user:
#             return True

#         # 2) Membre de ce dispensaire ?
#         return Doctor.objects.filter(
#             user=user,
#             dispensary=obj
#         ).exists()


