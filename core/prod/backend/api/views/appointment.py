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
import logging

# Configuration du logger
logger = logging.getLogger(__name__)
import logging

# Configuration du logger
logger = logging.getLogger(__name__)

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
    
    def get_queryset(self):
        logger.info(f"=== PATIENT APPOINTMENT LIST VIEW ===")
        logger.info(f"Utilisateur authentifié: {self.request.user.username}")
        
        try:
            # Appeler le mixin pour filtrer par utilisateur
            queryset = super().get_queryset()
            logger.info(f"Queryset après filtrage: {queryset.count()} appointments")
            
            # Ajouter des informations de debug sur les appointments
            for appointment in queryset[:5]:  # Log des 5 premiers
                logger.info(f"Appointment: {appointment.token}")
                logger.info(f"  - Patient: {appointment.patient.username}")
                logger.info(f"  - Dispensaire: {appointment.dispensary.name}")
                logger.info(f"  - Date: {appointment.date}")
                logger.info(f"  - Status: {appointment.status}")
                logger.info(f"  - Confirmed by: {appointment.confirmed_by.username if appointment.confirmed_by else 'None'}")
            
            return queryset
            
        except Exception as e:
            logger.error(f"Erreur lors de la récupération des appointments: {str(e)}")
            logger.error(f"Type d'erreur: {type(e).__name__}")
            import traceback
            logger.error(f"Traceback: {traceback.format_exc()}")
            raise
    
    def list(self, request, *args, **kwargs):
        logger.info(f"=== LIST METHOD PATIENT APPOINTMENTS ===")
        
        try:
            response = super().list(request, *args, **kwargs)
            logger.info(f"Réponse générée avec succès: {len(response.data)} items")
            return response
            
        except Exception as e:
            logger.error(f"Erreur dans list(): {str(e)}")
            logger.error(f"Type d'erreur: {type(e).__name__}")
            import traceback
            logger.error(f"Traceback: {traceback.format_exc()}")
            raise


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
        logger.info(f"=== PERFORM CREATE APPOINTMENT VIEW ===")
        logger.info(f"Validated data: {serializer.validated_data}")
        
        # Récupérer le token du dispensaire depuis les données validées
        disp_token = serializer.validated_data.get("dispensary_token")
        user = self.request.user
        
        logger.info(f"Token dispensaire: {disp_token}")
        logger.info(f"Utilisateur: {user.username}")
        
        try:
            dispensary = get_object_or_404(Dispensary, token=disp_token)
            logger.info(f"Dispensaire trouvé: {dispensary.name} (ID: {dispensary.id})")
        except Exception as e:
            logger.error(f"Erreur lors de la récupération du dispensaire: {str(e)}")
            raise
        
        # Sauvegarder le rendez-vous
        try:
            appointment = serializer.save(patient=user, dispensary=dispensary)
            logger.info(f"Rendez-vous créé avec succès: {appointment.token}")
            logger.info(f"Patient: {appointment.patient.username}")
            logger.info(f"Dispensaire: {appointment.dispensary.name}")
            logger.info(f"Date: {appointment.date}")
            logger.info(f"Heure: {appointment.hour}")
        except Exception as e:
            logger.error(f"Erreur lors de la sauvegarde du rendez-vous: {str(e)}")
            raise
        
    def create(self, request, *args, **kwargs):
        logger.info(f"=== CREATE APPOINTMENT REQUEST ===")
        logger.info(f"Données reçues: {request.data}")
        logger.info(f"Utilisateur authentifié: {request.user.username}")
        
        try:
            # Validation des données
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            logger.info(f"Données validées avec succès")
            
            # Création du rendez-vous
            self.perform_create(serializer)
            logger.info(f"Rendez-vous créé avec succès")
            
            # Récupération du dispensaire pour l'email
            # CORRECTION: Récupérer le dispensaire depuis le token, pas depuis validated_data
            disp_token = serializer.validated_data.get("dispensary_token")
            dispensary = get_object_or_404(Dispensary, token=disp_token)
            
            logger.info(f"Envoi d'email au dispensaire: {dispensary.name}")
            
            # Envoi de l'email de notification
            try:
                message = format_user_appointment_request(serializer.data)
                file_attachment = serializer.data.get("file") if serializer.data.get("file") else None
                send_email_to_dispensary_doctors(
                    dispensary, 
                    "Nouvelle demande de rendez-vous", 
                    message, 
                    [file_attachment] if file_attachment else None
                )
                logger.info(f"Email envoyé avec succès")
            except Exception as e:
                logger.error(f"Erreur lors de l'envoi de l'email: {str(e)}")
                # Ne pas faire échouer la création si l'email échoue
                pass
            
            logger.info(f"=== CREATION RENDEZ-VOUS TERMINEE AVEC SUCCES ===")
            return Response({
                "message": "Votre demande a bien été envoyée !",
                "appointment_token": serializer.instance.token if hasattr(serializer, 'instance') else None
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"=== ERREUR CREATION RENDEZ-VOUS ===")
            logger.error(f"Erreur: {str(e)}")
            logger.error(f"Type d'erreur: {type(e).__name__}")
            import traceback
            logger.error(f"Traceback: {traceback.format_exc()}")
            
            # Re-lever l'exception pour que DRF la gère
            raise
        
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
        data = dict(serializer.data)
        data['appointment_date'] = data.get('date')
        data['appointment_hour'] = data.get('hour')
        message = format_appointment_cancelled(data)
        send_email_to_dispensary_doctors(dispensary, "Annulation de rendez-vous", message, [data.get("file") if data.get("file") else None])
        return Response({
            "message": "Votre rendez-vous a bien été annulé et archivé !",
        }, status=status.HTTP_200_OK)