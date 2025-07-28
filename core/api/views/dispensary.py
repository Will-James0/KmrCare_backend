from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from api.models import Appointment, AppointmentHistory
from api.enums import AppointmentStatus
from django.shortcuts import get_object_or_404
from api.permissions import IsDispensaryMember
from account.authentication import AuthTokenAuthentication
from core.utils import *
from django.utils import timezone


class ConfirmAppointmentView(APIView):
    authentication_classes = [AuthTokenAuthentication]
    permission_classes = [IsDispensaryMember]

    def post(self, request, token):
        try:
            appointment = get_object_or_404(Appointment, token=token)
            appointment.status = AppointmentStatus.CONFIRMED
            appointment.save()

            # Envoi du mail
            data = {
                "appointment_date": appointment.date.strftime("%d/%m/%Y"),
                "appointment_hour": appointment.hour.strftime("%H:%M")
            }
            subject = "Confirmation de votre rendez-vous"
            message = format_appointment_confirmed(data)
            send_user_email(subject, message, appointment.patient.email)

            return Response({"message": "Rendez-vous confirmé avec succès !"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class RejectAppointmentView(APIView):
    authentication_classes = [AuthTokenAuthentication]
    permission_classes = [IsDispensaryMember]

    def post(self, request, token):
        try:
            appointment = get_object_or_404(Appointment, token=token)
            history = AppointmentHistory(
                patient=appointment.patient,
                dispensary=appointment.dispensary,
                date=appointment.date,
                hour=appointment.hour,
                reason=appointment.reason,
                file=appointment.file,
                final_status=AppointmentStatus.REJECTED,
                rejected_by=request.user,
                date_cancelled=timezone.now().date(),
                hour_cancelled=timezone.now().time(),
            )
            history.save()
            appointment.delete()

            # Envoi du mail
            data = {
                "appointment_date": history.date.strftime("%d/%m/%Y"),
                "appointment_hour": history.hour.strftime("%H:%M")
            }
            subject = "Rejet de votre rendez-vous"
            message = format_appointment_rejected(data)
            send_user_email(subject, message, history.patient.email)

            return Response({"message": "Rendez-vous rejeté avec succès !"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        
class DispensaryCancelAppointmentView(APIView):
    authentication_classes = [AuthTokenAuthentication]
    permission_classes = [IsDispensaryMember]

    def post(self, request, token):
        try:
            appointment = get_object_or_404(Appointment, token=token)
            if appointment.status == AppointmentStatus.PENDING:
                return Response({"error": "Impossible d'annuler un rendez-vous en attente."}, status=status.HTTP_400_BAD_REQUEST)
            appointment.status = AppointmentStatus.CANCELLED
            history = AppointmentHistory(
                patient=appointment.patient,
                dispensary=appointment.dispensary,
                date=appointment.date,
                hour=appointment.hour,
                reason=appointment.reason,
                file=appointment.file,
                final_status=AppointmentStatus.CANCELLED,
                cancelled_by=request.user,
                date_cancelled=timezone.now().date(),
                hour_cancelled=timezone.now().time(),
            )
            history.save()
            if appointment.file:
                 appointment.file.delete(save=False)
            # Suppression du fichier associé au rendez-vous
            appointment.delete()

            # Envoi du mail
            data = {
                "appointment_date": history.date.strftime("%d/%m/%Y"),
                "appointment_hour": history.hour.strftime("%H:%M")
            }
            subject = "Annulation de votre rendez-vous"
            message = format_appointment_cancelled(data)
            send_user_email(subject, message, history.patient.email)

            return Response({"message": "Rendez-vous annulé avec succès !"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        
class StartAppointmentView(APIView):
    authentication_classes = [AuthTokenAuthentication]
    permission_classes = [IsDispensaryMember]

    def post(self, request, token):
        try:
            appointment = get_object_or_404(Appointment, token=token)
            appointment.status = AppointmentStatus.IN_PROGRESS
            appointment.save()

            return Response({"message": "Début du rendez-vous !"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

class EndAppointmentView(APIView):
    authentication_classes = [AuthTokenAuthentication]
    permission_classes = [IsDispensaryMember]

    def post(self, request, token):
        observations = request.data.get("observations", "")
        if not observations:
            return Response({"error": "Les observations sont requises pour terminer le rendez-vous."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            appointment = get_object_or_404(Appointment, token=token)
            history = AppointmentHistory(
                patient=appointment.patient,
                dispensary=appointment.dispensary,
                date=appointment.date,
                hour=appointment.hour,
                reason=appointment.reason,
                file=appointment.file,
                final_status=AppointmentStatus.COMPLETED,
                observations=observations
            )
            history.save()
            if appointment.file:
                appointment.file.delete(save=False)
  # Suppression du fichier associé au rendez-vous
            appointment.delete()

            return Response({"message": "Rendez-vous terminé !"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
