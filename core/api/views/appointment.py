from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from api.serializers import AppointmentSerializer, CreateAppointmentSerializer, UpdateAppointmentSerializer
from api.models import Appointment, AppointmentHistory
from care.models import Dispensary
from api.mixins import DispensaryQuerySetMixin, UserQuerySetMixin
from account.authentication import AuthTokenAuthentication
from api.permissions import *
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.shortcuts import get_object_or_404
from api.enums import AppointmentStatus
from core.utils import *
from django.utils import timezone
from core.utils import *

#-----------------Listes--------------------------------#

class AdminAppointmentListView(generics.ListAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    authentication_classes = [AuthTokenAuthentication]
    permission_classes = [IsAdminUser]
    
    
class DispensaryAppointmentListView(DispensaryQuerySetMixin, generics.ListAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    authentication_classes = [AuthTokenAuthentication]
    permission_classes = [IsDispensaryMember]
    

class PatientAppointmentListView(UserQuerySetMixin, generics.ListAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    authentication_classes = [AuthTokenAuthentication]
    permission_classes = [IsAuthenticated, IsOwnRequest]


#--------------------Details------------------------------------#
    

class AdminAppointmentDetailView(generics.RetrieveAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    authentication_classes = [AuthTokenAuthentication]
    permission_classes = [IsAdminUser]
    lookup_field = "token"
    
    
class DispensaryAppointmentDetailView(DispensaryQuerySetMixin, generics.RetrieveAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    authentication_classes = [AuthTokenAuthentication]
    permission_classes = [IsDispensaryMember]
    lookup_field = "token"
    

class PatientAppointmentDetailView(UserQuerySetMixin, generics.RetrieveAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    authentication_classes = [AuthTokenAuthentication]
    permission_classes = [IsAuthenticated, IsOwnRequest]
    lookup_field = "token"
    

#--------------------POST----------------------------#


class MakeAnAppointmentView(generics.CreateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = CreateAppointmentSerializer
    authentication_classes = [AuthTokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        disp_token = serializer.validated_data.get("dispensary_token")
        user = self.request.user
        dispensary = get_object_or_404(Dispensary, token=disp_token)
        serializer.save(patient=user, dispensary=dispensary)
        
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        dispensary = serializer.validated_data.get("dispensary")
        message = format_user_appointment_request(serializer.data)
        send_email_to_dispensary_doctors(dispensary, "Nouvelle demande de rendez-vous", message, [serializer.data.get("file") if serializer.data.get("file") else None])
        return Response({
            "message": "Votre demande a bien été envoyée !",
        }, status=status.HTTP_201_CREATED)
        
        
#--------------------PUT/PATCH----------------------------#
class UpdateAppointmentView(generics.UpdateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = UpdateAppointmentSerializer
    lookup_field = "token"
    authentication_classes = [AuthTokenAuthentication]
    permission_classes = [IsAuthenticated, IsOwnRequest]
    
    
    def perform_update(self, serializer):
        appointment = serializer.save()
        appointment.status = AppointmentStatus.PENDING_MODIFICATION
        appointment.save(update_fields=["status"])
    
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        dispensary = instance.dispensary
        message = format_user_appointment_update(serializer.data)
        send_email_to_dispensary_doctors(dispensary, "Modification de rendez-vous", message, [serializer.data.get("file") if serializer.data.get("file") else None])
        return Response({
            "message": "Votre rendez-vous a bien été mis à jour !",
        }, status=status.HTTP_200_OK)
        
#--------------------CANCEL----------------------------#

class CancelAppointmentView(generics.UpdateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = UpdateAppointmentSerializer
    authentication_classes = [AuthTokenAuthentication]
    permission_classes = [IsAuthenticated, IsOwnRequest]
    lookup_field = "token"

    def perform_update(self, serializer):
        appointment = serializer.save()

        # 💾 Création de l'historique
        history = AppointmentHistory(
            patient=appointment.patient,
            dispensary=appointment.dispensary,
            date=appointment.date,
            hour=appointment.hour,
            reason=appointment.reason,
            file=appointment.file,
            final_status=AppointmentStatus.CANCELLED,
            cancelled_by=self.request.user,
            date_cancelled=timezone.now().date(),
            hour_cancelled=timezone.now().time(),
        )
        history.save()

        # ❌ Suppression du rendez-vous
        if appointment.file:
            appointment.file.delete(save=False)

        appointment.delete()

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        dispensary = instance.dispensary
        message = format_appointment_cancelled(serializer.data)
        send_email_to_dispensary_doctors(dispensary, "Annulation de rendez-vous", message, [serializer.data.get("file") if serializer.data.get("file") else None])
        return Response({
            "message": "Votre rendez-vous a bien été annulé et archivé !",
        }, status=status.HTTP_200_OK)