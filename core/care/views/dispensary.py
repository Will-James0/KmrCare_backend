from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from care.models import Dispensary, Doctor, Role
from django.db import transaction
from care.enums.role import RoleEnum
from care.serializers import DispensarySerializer, UpdateDispensarySerializer
from django.contrib.auth import get_user_model
from account.authentication import AuthTokenAuthentication
from care.permissions import dispensary as disp_perm
from rest_framework.permissions import IsAuthenticated, IsAdminUser


User = get_user_model()

class DispensaryDetailView(generics.RetrieveAPIView):
    queryset= Dispensary.objects.all()
    lookup_field = "token"
    serializer_class = DispensarySerializer


class UpdateDispensaryView(generics.UpdateAPIView):
    queryset = Dispensary.objects.all()
    lookup_field = "token"
    serializer_class = UpdateDispensarySerializer
    authentication_classes = [AuthTokenAuthentication]
    permission_classes = [IsAuthenticated, disp_perm.IsOwnerOrChiefDoctor]

    @transaction.atomic
    def perform_update(self, serializer):
        dispensary = serializer.instance        # avant mise à jour
        old_owner = dispensary.owner

        # ─── 1) Déterminer le nouveau propriétaire ───
        owner_token = serializer.validated_data.pop("owner_token", None)
        new_owner = old_owner  # par défaut pas de changement
        if owner_token:
            new_owner = get_object_or_404(User, token=owner_token)

        # ─── 2) Sauvegarder le dispensaire avec le nouveau owner ───
        serializer.save(owner=new_owner)

        # ─── 3) Si owner changé, mettre à jour la table Doctor ───
        if old_owner != new_owner:

            # a) Ancien owner ⇒ ajouter comme médecin (role DOCTOR)
            default_role = Role.objects.get(code=RoleEnum.DOCTOR)
            Doctor.objects.get_or_create(
                user=old_owner,
                dispensary=dispensary,
                defaults={"role": default_role}
            )

            # b) Nouveau owner ⇒ retirer son éventuel enregistrement Doctor
            Doctor.objects.filter(
                user=new_owner,
                dispensary=dispensary
            ).delete()


class DispensaryListView(generics.ListAPIView):
    queryset = Dispensary.objects.all()
    serializer_class = DispensarySerializer
    authentication_classes = [AuthTokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    
class DeleteDispensaryView(generics.DestroyAPIView):
    queryset = Dispensary.objects.all()
    lookup_field = "token"
    authentication_classes = [AuthTokenAuthentication]
    permission_classes = [IsAuthenticated, disp_perm.IsOwnerOrAdmin]