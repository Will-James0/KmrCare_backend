from django.core.mail import EmailMessage
from django.conf import settings
from django.contrib.auth import get_user_model
from care.models import Doctor, Dispensary
from django.shortcuts import get_object_or_404

User = get_user_model()

def send_user_email(subject, message, recipient_list, attachment_paths=None):
    try:
        email = EmailMessage(
            subject=subject,
            body=message,
            from_email=settings.EMAIL_HOST_USER,
            to=recipient_list
        )
        email.content_subtype = 'html'  # Pour envoyer un email en HTML

        if attachment_paths:
            for path in attachment_paths:
                email.attach_file(path)

        email.send(fail_silently=False)
    except Exception as e:
        import logging
        logging.error(f"Erreur lors de l'envoi de mail : {e}")

    


def send_email_to_admins(subject, message, attachment_paths=None):
    admins = User.objects.filter(is_staff=True).values_list('email', flat=True)
    if not admins:
        return
    send_user_email(subject, message, list(admins), attachment_paths or [])
    
    

def send_email_to_dispensary_doctors(dispensary, subject, message, attachment_paths=None):
    doctors = Doctor.objects.filter(dispensary=dispensary).select_related('user')
    
    # Récupération des emails des médecins
    recipients = [doctor.user.email for doctor in doctors if doctor.user.email]

    # Ajout de l'email du propriétaire si présent
    if dispensary.owner and dispensary.owner.email:
        recipients.append(dispensary.owner.email)

    if not recipients:
        return  # Aucun email à envoyer

    send_user_email(subject, message, recipients, attachment_paths or [])
    