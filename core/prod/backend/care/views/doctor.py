from rest_framework.views import APIView
from rest_framework.response import Response
from care.serializers import doctor
from care.models import Doctor, Dispensary, Role
from django.shortcuts import get_object_or_404
from account.authentication import AuthTokenAuthentication
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from care.permissions import IsOwner, IsOwnerOrChiefDoctor, CanDeleteDoctor
from care.permissions import doctor as doctor_perm
from django.contrib.auth import get_user_model
from rest_framework import generics, permissions
from care.mixins import doctor as doctor_mixins
import logging
from django.db import IntegrityError

# Configuration du logger
logger = logging.getLogger(__name__)

User = get_user_model()


class AddDoctorView(APIView):
    
    authentication_classes = [AuthTokenAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrChiefDoctor]
    
    def post(self, request, token):
        logger.info(f"=== DEBUT CREATION DOCTEUR ===")
        logger.info(f"Token dispensaire: {token}")
        logger.info(f"Utilisateur authentifié: {request.user.username if request.user.is_authenticated else 'Non authentifié'}")
        logger.info(f"Données reçues: {request.data}")
        
        try:
            # Vérification de l'existence du dispensaire
            try:
                dispensary = get_object_or_404(Dispensary, token=token)
                logger.info(f"Dispensaire trouvé: {dispensary.name} (ID: {dispensary.id})")
            except Exception as e:
                logger.error(f"Erreur lors de la récupération du dispensaire avec token {token}: {str(e)}")
                return Response({
                    "message": "Dispensaire non trouvé",
                    "error": f"Token invalide: {token}"
                }, status=404)
            
            # Validation du sérializeur
            serializer = doctor.AddDoctorSerializer(data=request.data)
            
            if not serializer.is_valid():
                logger.error(f"Erreurs de validation du sérializeur:")
                for field, errors in serializer.errors.items():
                    logger.error(f"  - {field}: {errors}")
                
                return Response({
                    "message": "Données de validation incorrectes",
                    "errors": serializer.errors,
                    "received_data": request.data
                }, status=400)
            
            data = serializer.validated_data
            logger.info(f"Données validées: {data}")
            
            # Création du médecin avec le serializer
            try:
                # Utiliser le serializer pour créer le médecin avec la spécialisation
                serializer_context = {"dispensary": dispensary}
                create_serializer = doctor.AddDoctorSerializer(data=data, context=serializer_context)
                
                if create_serializer.is_valid():
                    medecin = create_serializer.save()
                    user = medecin.user
                    user_role = medecin.role
                    logger.info(f"Docteur créé avec spécialisation: {medecin.token} pour l'utilisateur {user.username}")
                    logger.info(f"Spécialisation: {medecin.specialization}")
                else:
                    logger.error(f"Erreurs de validation du serializer de création:")
                    for field, errors in create_serializer.errors.items():
                        logger.error(f"  - {field}: {errors}")
                    return Response({
                        "message": "Erreur lors de la validation des données",
                        "errors": create_serializer.errors
                    }, status=400)
                
            except IntegrityError as e:
                logger.error(f"Erreur d'intégrité lors de la création du médecin: {str(e)}")
                return Response({
                    "message": "Erreur lors de la création du médecin",
                    "error": "Ce médecin existe déjà dans ce dispensaire"
                }, status=400)
            except Exception as e:
                logger.error(f"Erreur lors de la création du médecin: {str(e)}")
                return Response({
                    "message": "Erreur lors de la création du médecin",
                    "error": str(e)
                }, status=500)
            
            logger.info(f"=== CREATION DOCTEUR REUSSIE ===")
            logger.info(f"Docteur: {user.first_name} {user.last_name}")
            logger.info(f"Email: {user.email}")
            logger.info(f"Username: {user.username}")
            logger.info(f"Dispensaire: {dispensary.name}")
            logger.info(f"Rôle: {user_role.label}")
            logger.info(f"Spécialisation: {medecin.specialization}")
            
            return Response({
                "message": "Médecin ajouté avec succès.",
                "doctor": {
                    "token": medecin.token,
                    "full_name": f"{user.first_name} {user.last_name}",
                    "email": user.email,
                    "username": user.username,
                    "role": user_role.label,
                    "dispensary": dispensary.name,
                    "specialization": medecin.specialization
                }
            }, status=201)
            
        except Exception as e:
            logger.error(f"=== ERREUR GENERALE CREATION DOCTEUR ===")
            logger.error(f"Exception non gérée: {str(e)}")
            logger.error(f"Type d'exception: {type(e).__name__}")
            import traceback
            logger.error(f"Traceback: {traceback.format_exc()}")
            
            return Response({
                "message": "Une erreur inattendue est survenue",
                "error": str(e)
            }, status=500)
            

class DeleteDoctorView(generics.DestroyAPIView):
    
    authentication_classes = [AuthTokenAuthentication]
    permission_classes = [IsAuthenticated, CanDeleteDoctor]
    queryset = Doctor.objects.all()
    serializer_class = doctor.DoctorSerializer
    lookup_field = 'token'
    
    
class ListDoctorView(doctor_mixins.UserQuerySetMixin, generics.ListAPIView):
    
    authentication_classes = [AuthTokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Doctor.objects.all()
    serializer_class = doctor.DoctorSerializer
    lookup_field = 'token'
    user_field = 'owner'
    

class RetrieveDctorView(doctor_mixins.UserQuerySetMixin, generics.RetrieveAPIView):
    
    authentication_classes = [AuthTokenAuthentication]
    permission_classes = [IsAuthenticated, doctor_perm.IsOwnerOrChiefDoctor]
    queryset = Doctor.objects.all()
    serializer_class = doctor.DoctorSerializer
    lookup_field = 'token'
    user_field = 'owner'
