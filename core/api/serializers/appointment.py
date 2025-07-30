from rest_framework import serializers
from api.models import Appointment
from care.serializers import UserPublicSerializer, DispensaryPublicSerializer
from api.validators import validate_hour_within_dispensary, validate_modification_timing
import logging
from django.contrib.auth import get_user_model

User = get_user_model()

# Configuration du logger
logger = logging.getLogger(__name__)

class PublicUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'phone']

class AppointmentSerializer(serializers.ModelSerializer):
    patient = PublicUserSerializer(read_only=True)
    dispensary = serializers.CharField(source="dispensary.name", read_only=True)
    confirmed_by = PublicUserSerializer(read_only=True)

    class Meta:
        model = Appointment
        fields = ["patient", "dispensary", "date", "hour", "reason", "file", "created_at", "updated_at", "token", "confirmed_by", "status"]
        extra_kwargs = {
            "file": {"required": False, "allow_null": True},
            "created_at": {"read_only": True}, "updated_at": {"read_only": True},
            "token": {"read_only": True},
            "confirmed_by": {"read_only": True},
            "status": {"read_only": True}
        }
        

class UpdateAppointmentSerializer(serializers.ModelSerializer):
    patient = UserPublicSerializer(read_only=True)
    observations = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = Appointment
        fields = ["patient", "date", "hour", "reason", "file", "status", "observations"]
        extra_kwargs = {
            "date": {"allow_null": True},
            "hour": {"allow_null": True},
            "reason": {"allow_null": True, "allow_blank": True},
            "file": {"required": False, "allow_null": True},
            "status": {"read_only": True},
        }

    def validate(self, attrs):
        logger.info(f"=== VALIDATION UPDATE APPOINTMENT ===")
        logger.info(f"Attributs reçus: {attrs}")
        logger.info(f"Instance: {self.instance}")
        
        try:
            attrs = validate_hour_within_dispensary(attrs)  # Correction ici : 1 seul argument
            logger.info(f"Validation heure/dispensaire réussie")
        except Exception as e:
            logger.error(f"Erreur validation heure/dispensaire: {str(e)}")
            raise
        
        try:
            attrs = validate_modification_timing(attrs, self.instance)
            logger.info(f"Validation timing réussie")
        except Exception as e:
            logger.error(f"Erreur validation timing: {str(e)}")
            raise
            
        logger.info(f"Attributs validés: {attrs}")
        return attrs
        
        
class CreateAppointmentSerializer(serializers.ModelSerializer):
    patient = UserPublicSerializer(read_only=True)
    dispensary = DispensaryPublicSerializer(read_only=True)
    dispensary_token = serializers.UUIDField(write_only=True, required=False, allow_null=True)
    
    class Meta:
        model = Appointment
        fields = ["patient", "dispensary", "dispensary_token", "date", "hour", "reason", "file"]
        extra_kwargs = {
            "file": {"required": False, "allow_null": True},
        }
    
    def __init__(self, *args, **kwargs):
        logger.info(f"=== INITIALISATION CreateAppointmentSerializer ===")
        logger.info(f"Args: {args}")
        logger.info(f"Kwargs: {kwargs}")
        super().__init__(*args, **kwargs)
        
    def to_internal_value(self, data):
        logger.info(f"=== TO_INTERNAL_VALUE CreateAppointmentSerializer ===")
        logger.info(f"Données reçues: {data}")
        logger.info(f"Type des données: {type(data)}")
        
        try:
            result = super().to_internal_value(data)
            logger.info(f"Données converties avec succès: {result}")
            return result
        except Exception as e:
            logger.error(f"Erreur lors de la conversion des données: {str(e)}")
            logger.error(f"Type d'erreur: {type(e).__name__}")
            raise
    
    def validate_date(self, value):
        logger.info(f"=== VALIDATION DATE ===")
        logger.info(f"Date reçue: {value} (type: {type(value)})")
        
        if not value:
            logger.error("Date manquante")
            raise serializers.ValidationError("La date est requise")
        
        from datetime import date
        if isinstance(value, str):
            try:
                from datetime import datetime
                parsed_date = datetime.strptime(value, '%Y-%m-%d').date()
                logger.info(f"Date parsée: {parsed_date}")
                value = parsed_date
            except ValueError as e:
                logger.error(f"Format de date invalide: {e}")
                raise serializers.ValidationError("Format de date invalide. Utilisez YYYY-MM-DD")
        
        if value < date.today():
            logger.error(f"Date dans le passé: {value}")
            raise serializers.ValidationError("La date ne peut pas être dans le passé")
        
        logger.info(f"Date validée: {value}")
        return value
    
    def validate_hour(self, value):
        logger.info(f"=== VALIDATION HOUR ===")
        logger.info(f"Heure reçue: {value} (type: {type(value)})")
        
        if not value:
            logger.error("Heure manquante")
            raise serializers.ValidationError("L'heure est requise")
        
        from datetime import time
        if isinstance(value, str):
            try:
                from datetime import datetime
                parsed_time = datetime.strptime(value, '%H:%M').time()
                logger.info(f"Heure parsée: {parsed_time}")
                value = parsed_time
            except ValueError as e:
                logger.error(f"Format d'heure invalide: {e}")
                raise serializers.ValidationError("Format d'heure invalide. Utilisez HH:MM")
        
        logger.info(f"Heure validée: {value}")
        return value
    
    def validate_dispensary_token(self, value):
        logger.info(f"=== VALIDATION DISPENSARY_TOKEN ===")
        logger.info(f"Token reçu: {value} (type: {type(value)})")
        
        if not value:
            logger.error("Token de dispensaire manquant")
            raise serializers.ValidationError("Le token du dispensaire est requis")
        
        # Vérifier l'existence du dispensaire
        from care.models import Dispensary
        try:
            dispensary = Dispensary.objects.get(token=value)
            logger.info(f"Dispensaire trouvé: {dispensary.name} (ID: {dispensary.id})")
        except Dispensary.DoesNotExist:
            logger.error(f"Dispensaire non trouvé avec le token: {value}")
            raise serializers.ValidationError("Dispensaire non trouvé")
        except Exception as e:
            logger.error(f"Erreur lors de la recherche du dispensaire: {str(e)}")
            raise serializers.ValidationError("Erreur lors de la vérification du dispensaire")
        
        logger.info(f"Token de dispensaire validé: {value}")
        return value
    
    def validate_reason(self, value):
        logger.info(f"=== VALIDATION REASON ===")
        logger.info(f"Raison reçue: {value} (type: {type(value)})")
        
        if value and len(value.strip()) < 5:
            logger.error(f"Raison trop courte: {len(value.strip())} caractères")
            raise serializers.ValidationError("La raison doit contenir au moins 5 caractères")
        
        logger.info(f"Raison validée: {value}")
        return value
        
    def validate(self, attrs):
        logger.info(f"=== VALIDATION GLOBALE CreateAppointmentSerializer ===")
        logger.info(f"Attributs reçus: {attrs}")
        
        # Vérification des champs requis
        required_fields = ['date', 'hour', 'dispensary_token']
        missing_fields = []
        
        for field in required_fields:
            if field not in attrs or attrs[field] is None:
                missing_fields.append(field)
        
        if missing_fields:
            logger.error(f"Champs manquants: {missing_fields}")
            raise serializers.ValidationError({
                'error': f"Champs manquants: {', '.join(missing_fields)}"
            })
        
        try:
            logger.info("Appel de validate_hour_within_dispensary")
            attrs = validate_hour_within_dispensary(attrs)
            logger.info(f"Validation heure/dispensaire réussie")
        except Exception as e:
            logger.error(f"Erreur validation heure/dispensaire: {str(e)}")
            logger.error(f"Type d'erreur: {type(e).__name__}")
            import traceback
            logger.error(f"Traceback: {traceback.format_exc()}")
            raise
            
        logger.info(f"Attributs validés finaux: {attrs}")
        return attrs
    
    def create(self, validated_data):
        logger.info(f"=== CREATION APPOINTMENT ===")
        logger.info(f"Données validées pour création: {validated_data}")
        
        try:
            # Récupérer et supprimer le dispensary_token des données validées
            # car le dispensary sera fourni par la vue via save()
            dispensary_token = validated_data.pop('dispensary_token', None)
            logger.info(f"Token dispensaire supprimé des données: {dispensary_token}")
            logger.info(f"Données après suppression du token: {validated_data}")
            
            # Le dispensary et patient seront fournis par la vue via serializer.save()
            # Donc on crée avec les données restantes seulement
            appointment = Appointment.objects.create(**validated_data)
            
            logger.info(f"Rendez-vous créé avec succès: {appointment.token}")
            return appointment
            
        except Exception as e:
            logger.error(f"Erreur lors de la création du rendez-vous: {str(e)}")
            logger.error(f"Type d'erreur: {type(e).__name__}")
            import traceback
            logger.error(f"Traceback: {traceback.format_exc()}")
            raise