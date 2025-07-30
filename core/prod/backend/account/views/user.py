from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.exceptions import PermissionDenied
from account.authentication import AuthTokenAuthentication
from rest_framework import status
from rest_framework import generics
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from account.serializers.user import UserSerializer, UserUpdateSerializer, UserRoleSerializer
import logging

# Configuration du logger
logger = logging.getLogger(__name__)

User = get_user_model()

class AdminHierarchyMixin:
    """
    Mixin pour gérer la hiérarchie des permissions administrateur.
    Empêche un utilisateur de modifier des comptes de rang supérieur ou égal au sien.
    """
    
    def check_hierarchy_permissions(self, target_user, action="modifier"):
        """
        Vérifie si l'utilisateur actuel peut effectuer une action sur l'utilisateur cible.
        
        Args:
            target_user: L'utilisateur cible de l'action
            action: Type d'action (pour les messages d'erreur)
        
        Raises:
            PermissionDenied: Si l'action n'est pas autorisée
        """
        current_user = self.request.user
        
        # 1. Un utilisateur ne peut pas se modifier lui-même (sauf superuser pour certaines actions)
        if current_user.id == target_user.id and not current_user.is_superuser:
            logger.warning(f"Utilisateur {current_user.username} a tenté de {action} son propre compte")
            raise PermissionDenied("Vous ne pouvez pas modifier votre propre compte.")
        
        # 2. Seul un superuser peut modifier un autre superuser
        if target_user.is_superuser and not current_user.is_superuser:
            logger.warning(f"Utilisateur {current_user.username} (non-superuser) a tenté de {action} le superuser {target_user.username}")
            raise PermissionDenied("Seul un superutilisateur peut modifier un compte superutilisateur.")
        
        # 3. Un staff ne peut pas modifier un autre staff (sauf si superuser)
        if target_user.is_staff and current_user.is_staff and not current_user.is_superuser and current_user.id != target_user.id:
            logger.warning(f"Utilisateur staff {current_user.username} a tenté de {action} un autre staff {target_user.username}")
            raise PermissionDenied("Vous ne pouvez pas modifier un compte ayant des privilèges d'administration équivalents ou supérieurs.")
        
        logger.info(f"Permission accordée à {current_user.username} pour {action} {target_user.username}")
        
    def check_role_elevation_permissions(self, target_user, new_data):
        """
        Vérifie si l'utilisateur actuel peut élever les privilèges de l'utilisateur cible.
        """
        current_user = self.request.user
        
        # Récupération des nouveaux privilèges demandés
        new_is_superuser = new_data.get('is_superuser', target_user.is_superuser)
        new_is_staff = new_data.get('is_staff', target_user.is_staff)
        
        # Un utilisateur ne peut pas s'auto-promouvoir (sauf superuser)
        if current_user.id == target_user.id and not current_user.is_superuser:
            if (new_is_superuser and not target_user.is_superuser) or (new_is_staff and not target_user.is_staff):
                logger.warning(f"Utilisateur {current_user.username} a tenté de s'auto-promouvoir")
                raise PermissionDenied("Vous ne pouvez pas vous auto-promouvoir.")
        
        # Seul un superuser peut créer d'autres superusers
        if new_is_superuser and not target_user.is_superuser and not current_user.is_superuser:
            logger.warning(f"Utilisateur non-superuser {current_user.username} a tenté de promouvoir {target_user.username} en superuser")
            raise PermissionDenied("Seul un superutilisateur peut accorder des privilèges de superutilisateur.")
        
        # Un staff ne peut pas promouvoir quelqu'un au rang de staff (sauf superuser)
        if new_is_staff and not target_user.is_staff and current_user.is_staff and not current_user.is_superuser:
            logger.warning(f"Utilisateur staff {current_user.username} a tenté de promouvoir {target_user.username} en staff")
            raise PermissionDenied("Vous ne pouvez pas accorder des privilèges d'administration.")
        
        logger.info(f"Permission accordée à {current_user.username} pour modifier les rôles de {target_user.username}")

class ListUsersView(generics.ListAPIView):
    """
    Vue pour lister tous les utilisateurs.
    Accessible aux administrateurs seulement.
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [AuthTokenAuthentication]
    serializer_class = UserSerializer
    queryset = User.objects.all()
    
class UserDetailView(generics.RetrieveAPIView):
    """
    Vue pour voir les détails d'un utilisateur.
    Accessible aux administrateurs seulement.
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [AuthTokenAuthentication]
    serializer_class = UserSerializer
    queryset = User.objects.all()
    lookup_field = 'token'
    
    
class UpdateUserView(AdminHierarchyMixin, generics.UpdateAPIView):
    """
    Vue pour mettre à jour un utilisateur.
    Avec protections hiérarchiques.
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [AuthTokenAuthentication]
    serializer_class = UserUpdateSerializer
    queryset = User.objects.all()
    lookup_field = 'token'
    
    def perform_update(self, serializer):
        """
        Effectue la mise à jour avec vérification des permissions hiérarchiques.
        """
        target_user = self.get_object()
        
        # Vérification des permissions hiérarchiques
        self.check_hierarchy_permissions(target_user, "mettre à jour")
        
        # Vérification spéciale pour les changements de rôles dans UserUpdateSerializer
        new_data = serializer.validated_data
        if 'is_staff' in new_data or 'is_superuser' in new_data:
            self.check_role_elevation_permissions(target_user, new_data)
        
        logger.info(f"Mise à jour de {target_user.username} par {self.request.user.username}")
        serializer.save()
    
    
class DeleteUserView(AdminHierarchyMixin, generics.DestroyAPIView):
    """
    Vue pour supprimer un utilisateur.
    Avec protections hiérarchiques.
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [AuthTokenAuthentication]
    serializer_class = UserSerializer
    queryset = User.objects.all()
    lookup_field = 'token'
    
    def perform_destroy(self, instance):
        """
        Effectue la suppression avec vérification des permissions hiérarchiques.
        """
        # Vérification des permissions hiérarchiques
        self.check_hierarchy_permissions(instance, "supprimer")
        
        # Protection supplémentaire : empêcher la suppression du dernier superuser
        if instance.is_superuser:
            superuser_count = User.objects.filter(is_superuser=True).count()
            if superuser_count <= 1:
                logger.warning(f"Tentative de suppression du dernier superuser par {self.request.user.username}")
                raise PermissionDenied("Impossible de supprimer le dernier superutilisateur du système.")
        
        logger.info(f"Suppression de {instance.username} par {self.request.user.username}")
        instance.image.delete()
        return super().perform_destroy(instance)
    

class UpdateUserRoleView(AdminHierarchyMixin, generics.UpdateAPIView):
    """
    Vue pour mettre à jour les rôles d'un utilisateur.
    Avec protections hiérarchiques strictes.
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [AuthTokenAuthentication]
    serializer_class = UserRoleSerializer
    queryset = User.objects.all()
    lookup_field = 'token'
    
    def perform_update(self, serializer):
        """
        Effectue la mise à jour des rôles avec vérifications strictes.
        """
        target_user = self.get_object()
        current_user = self.request.user
        
        # 1. Vérification des permissions hiérarchiques de base
        self.check_hierarchy_permissions(target_user, "modifier les rôles de")
        
        # 2. Vérification des permissions d'élévation de privilèges
        self.check_role_elevation_permissions(target_user, serializer.validated_data)
        
        # 3. Protection spéciale : empêcher la révocation du dernier superuser
        new_is_superuser = serializer.validated_data.get('is_superuser', target_user.is_superuser)
        if target_user.is_superuser and not new_is_superuser:
            superuser_count = User.objects.filter(is_superuser=True).count()
            if superuser_count <= 1:
                logger.warning(f"Tentative de révocation du dernier superuser par {current_user.username}")
                raise PermissionDenied("Impossible de révoquer les privilèges du dernier superutilisateur du système.")
        
        # 4. Log de l'action
        changes = []
        for field in ['is_staff', 'is_superuser', 'is_active']:
            if field in serializer.validated_data:
                old_value = getattr(target_user, field)
                new_value = serializer.validated_data[field]
                if old_value != new_value:
                    changes.append(f"{field}: {old_value} → {new_value}")
        
        logger.info(f"Modification des rôles de {target_user.username} par {current_user.username}: {', '.join(changes)}")
        
        # 5. Sauvegarde
        serializer.save()
