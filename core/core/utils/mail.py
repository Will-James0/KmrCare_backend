from django.core.mail import EmailMessage
from django.conf import settings

def send_user_email(subject, message, recipient_list, attachment_paths):
    email = EmailMessage(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        recipient_list,
    )

    for attachment_path in attachment_paths:
        email.attach_file(attachment_path)

    email.send(fail_silently=False)