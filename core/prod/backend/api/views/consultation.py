from api.models import Consultation
from api.serializers.consultation import ConsultationSerializer
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from account.authentication import AuthTokenAuthentication
from care.models import Dispensary
from django.contrib.auth import get_user_model
from api.permissions import IsDispensaryMemberOrPatient

User = get_user_model()

class CreateConsultationRoomView(generics.CreateAPIView):
    serializer_class = ConsultationSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [AuthTokenAuthentication]

    def perform_create(self, serializer):
        patient_token = self.request.data.get('patient_token')
        dispensary_token = self.request.data.get('dispensary_token')
        
        patient = get_object_or_404(User, token=patient_token)
        dispensary = get_object_or_404(Dispensary, token=dispensary_token)
        
        # Vérifier que l'utilisateur actuel est membre du dispensaire
        user = self.request.user
        if not (dispensary.owner == user or dispensary.doctors.filter(user=user).exists()):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Vous n'êtes pas autorisé à créer une consultation pour ce dispensaire.")
        
        serializer.save(
            patient=patient,
            dispensary=dispensary,
            created_by=user
        )
        
class ConsultationListView(generics.ListAPIView):
    serializer_class = ConsultationSerializer
    permission_classes = [permissions.IsAuthenticated, IsDispensaryMemberOrPatient]
    authentication_classes = [AuthTokenAuthentication]

    def get_queryset(self):
        user = self.request.user
        return Consultation.objects.filter(
            dispensary__doctors__user=user
        ).select_related('dispensary', 'patient').order_by('-created_at')

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
