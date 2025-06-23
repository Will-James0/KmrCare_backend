from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from api.serializers import AppointmentSerializer, CreateAppointmentSerializer, UpdateAppointmentSerializer
from api.models import Appointment
from care.models import Dispensary
from api.mixins import DispensaryQuerySetMixin, UserQuerySetMixin
from account.authentication import AuthTokenAuthentication
from api.permissions import IsDispensaryMember
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.shortcuts import get_object_or_404
from api.enums import AppointmentStatus


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
    permission_classes = [IsAuthenticated]


#--------------------Details------------------------------------#
    

class AdminAppointmentDetailView(generics.RetrieveAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    authentication_classes = [AuthTokenAuthentication]
    permission_classes = [IsAdminUser]
    
    
class DispensaryAppointmentDetailView(DispensaryQuerySetMixin, generics.RetrieveAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    authentication_classes = [AuthTokenAuthentication]
    permission_classes = [IsDispensaryMember]
    

class PatientAppointmentDetailView(UserQuerySetMixin, generics.RetrieveAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    authentication_classes = [AuthTokenAuthentication]
    permission_classes = [IsAuthenticated]
    

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
        return Response({
            "message": "Votre demande a bien été envoyée !",
        }, status=status.HTTP_201_CREATED)
        
        
#--------------------PUT/PATCH----------------------------#
class UpdateAppointmentView(generics.UpdateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = UpdateAppointmentSerializer
    authentication_classes = [AuthTokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    
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
        return Response({
            "message": "Votre rendez-vous a bien été mis à jour !",
        }, status=status.HTTP_200_OK)
        
#--------------------CANCEL----------------------------#

class CancelAppointmentView(generics.UpdateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = UpdateAppointmentSerializer
    authentication_classes = [AuthTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        appointment = serializer.save()
        appointment.status = AppointmentStatus.CANCELLED
        appointment.cancelled_by = self.request.user
        appointment.save(update_fields=["status", "cancelled_by"])

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            "message": "Votre rendez-vous a bien été annulé !",
        }, status=status.HTTP_200_OK)