from rest_framework.permissions import BasePermission
from django.shortcuts import get_object_or_404
from api.models import Consultation, Dispensary

class IsDispensaryMemberOrPatient(BasePermission):
    """
    Permission pour vérifier si l'utilisateur est membre du dispensaire
    ou patient de la consultation.
    """
    def has_permission(self, request, view):
        user = request.user
        if not user.is_authenticated:
            return False

        # Vérifier si l'utilisateur est membre du dispensaire
        if view.kwargs.get('dispensary_token'):
            dispensary = get_object_or_404(Dispensary, token=view.kwargs['dispensary_token'])
            if dispensary.owner == user or dispensary.doctors.filter(user=user).exists():
                return True

        # Vérifier si l'utilisateur est le patient de la consultation
        if view.kwargs.get('consultation_token'):
            consultation = get_object_or_404(Consultation, token=view.kwargs['consultation_token'])
            if consultation.patient == user:
                return True

        return False