# KMRCare Backend Documentation

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Modules](#modules)
- [API Endpoints](#api-endpoints)
- [Système de notifications](#système-de-notifications)
- [Permissions et sécurité](#permissions-et-sécurité)
- [Déploiement](#déploiement)

## 🏥 Vue d'ensemble

KMRCare Backend est une application Django REST qui fournit une API complète pour un système de gestion de rendez-vous médicaux. Le système permet la gestion des dispensaires, médecins, patients et rendez-vous avec un système de notifications par email.

### Fonctionnalités principales

- ✅ Gestion des utilisateurs et authentification
- 🏥 Gestion des dispensaires et médecins
- 📅 Système de rendez-vous complet
- 📧 Notifications email automatiques
- 🔐 Système de permissions granulaire
- 🌐 Support WebSockets pour temps réel

## 🏗️ Architecture

### Structure du projet

```
core/
├── account/           # Gestion des comptes utilisateurs
├── api/              # API principale et modèles
├── care/             # Gestion des soins (dispensaires, médecins)
├── core/             # Configuration Django principale
├── manage.py
├── requirements.txt
└── db.sqlite3
```

### Applications Django

#### [`account/`](core/account/)
Gestion des utilisateurs et authentification :
- Authentification par token personnalisée ([`authentication.py`](core/account/authentication.py))
- Vues de connexion ([`views/login.py`](core/account/views/login.py))
- Inscription et approbation ([`views/register.py`](core/account/views/register.py))

#### [`care/`](core/care/)
Gestion des structures de soins :
- **Modèles** : [`Dispensary`](core/care/models/dispensary.py), [`Doctor`](core/care/models/doctor.py)
- **Permissions** : Système de droits granulaires ([`permissions/`](core/care/permissions/))
- **URLs** : Configuration des endpoints ([`urls.py`](core/care/urls.py))

#### [`api/`](core/api/)
API principale et modèles métier :
- **Modèles** : [`Appointment`](core/api/models/appointment.py)
- **Vues** : Gestion des rendez-vous ([`views/dispensary.py`](core/api/views/dispensary.py))
- **WebSockets** : Configuration temps réel ([`routing.py`](core/api/routing.py))

## 🚀 Installation

### Prérequis

- Python 3.8+
- pip
- Git

### Étapes d'installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd kmrcare/backend/core
```

2. **Créer l'environnement virtuel**
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows
```

3. **Installer les dépendances**
```bash
pip install -r requirements.txt
```

4. **Configuration de l'environnement**
```bash
cp .env.example .env
# Éditer le fichier .env avec vos paramètres
```

5. **Base de données**
```bash
python manage.py migrate
python manage.py createsuperuser  # Optionnel
```

6. **Démarrage**
```bash
python manage.py runserver
```

## ⚙️ Configuration

### Variables d'environnement

Le fichier [`.env`](core/.env) contient la configuration email :

```env
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'mail.thehunter23.site'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'kmrcare@thehunter23.site'
EMAIL_HOST_PASSWORD = 'KMRCare@2025'
```

### Paramètres Django

Configuration principale dans [`settings.py`](core/core/settings.py) :

```python
LANGUAGE_CODE = 'fr-FR'
TIME_ZONE = 'UTC'
AUTH_USER_MODEL = 'account.User'
MEDIA_URL = 'media/'
STATIC_URL = 'static/'
```

## 📦 Modules

### 1. Gestion des utilisateurs

#### Modèles principaux
- **User** : Modèle utilisateur personnalisé
- **WaitingUser** : Demandes d'inscription en attente

#### Authentification
- Authentification par token via [`AuthTokenAuthentication`](core/account/authentication.py)
- Connexion spécialisée pour médecins ([`DoctorLoginAPIView`](core/account/views/login.py))

#### Processus d'inscription
1. Soumission de demande
2. Validation par administrateur ([`ApproveRegisterView`](core/account/views/register.py))
3. Création automatique du dispensaire

### 2. Gestion des dispensaires

#### Modèle [`Dispensary`](core/care/models/dispensary.py)
```python
class Dispensary(models.Model):
    owner = models.ForeignKey(User, ...)
    name = models.CharField(max_length=255, unique=True)
    specialities = models.TextField()
    quarter = models.CharField(max_length=255)
    phone = models.CharField(max_length=50)
    opening = models.TimeField()
    ending = models.TimeField()
    logo = models.ImageField(upload_to='dispensary_logos/')
```

#### Fonctionnalités
- CRUD complet via [`care/views/dispensary.py`](core/care/views/dispensary.py)
- Changement de propriétaire avec mise à jour automatique des médecins
- Upload de logo

### 3. Gestion des médecins

#### Modèle [`Doctor`](core/care/models/doctor.py)
```python
class Doctor(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    dispensary = models.ForeignKey(Dispensary, related_name='doctors')
    role = models.ForeignKey(Role, on_delete=models.SET_NULL)
    token = models.UUIDField(default=uuid.uuid4, unique=True)
```

#### Rôles disponibles
- **DOCTOR** : Médecin standard
- **CHIEF_DOCTOR** : Médecin chef (permissions étendues)

#### Permissions ([`care/permissions/doctor.py`](core/care/permissions/doctor.py))
- [`CanDeleteDoctor`](core/care/permissions/doctor.py) : Contrôle la suppression
- [`IsOwnerOrChiefDoctor`](core/care/permissions/doctor.py) : Accès aux données

### 4. Système de rendez-vous

#### Modèle [`Appointment`](core/api/models/appointment.py)
```python
class Appointment(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE)
    dispensary = models.ForeignKey(Dispensary, on_delete=models.SET_NULL)
    date = models.DateField()
    hour = models.TimeField()
    reason = models.TextField()
    file = models.FileField(upload_to=upload_to)
    status = models.CharField(choices=AppointmentStatus.choices)
```

#### États des rendez-vous
- **PENDING** : En attente
- **CONFIRMED** : Confirmé
- **IN_PROGRESS** : En cours
- **COMPLETED** : Terminé
- **CANCELLED** : Annulé
- **REJECTED** : Rejeté

#### Gestion du cycle de vie
Les vues dans [`api/views/dispensary.py`](core/api/views/dispensary.py) :

- [`ConfirmAppointmentView`](core/api/views/dispensary.py) : Confirmation avec email
- [`StartAppointmentView`](core/api/views/dispensary.py) : Début de consultation
- [`EndAppointmentView`](core/api/views/dispensary.py) : Fin avec archivage
- [`DispensaryCancelAppointmentView`](core/api/views/dispensary.py) : Annulation

## 🌐 API Endpoints

### Authentification (`/auth/`)
```
POST /auth/login/          # Connexion standard
POST /auth/doctor/login/   # Connexion médecin
POST /auth/register/       # Inscription
POST /auth/approve/<token>/ # Approbation
```

### Dispensaires (`/care/dispensary/`)
```
GET    /care/dispensary/list/              # Liste
GET    /care/dispensary/details/<token>/   # Détails
PUT    /care/dispensary/update/<token>/    # Modification
DELETE /care/dispensary/delete/<token>/    # Suppression
```

### Médecins (`/care/doctor/`)
```
GET    /care/doctor/list/             # Liste
POST   /care/doctor/create/<token>/   # Ajout
GET    /care/doctor/details/<token>/  # Détails
DELETE /care/doctor/delete/<token>/   # Suppression
```

## 📧 Système de notifications

### Utilitaires email

Module [`core/utils/mail.py`](core/core/utils/mail.py) :

```python
def send_user_email(subject, message, recipient_list)
def send_email_to_admins(subject, message)
def send_email_to_dispensary_doctors(dispensary, subject, message)
```

### Templates HTML

Module [`core/utils/format.py`](core/core/utils/format.py) avec templates pour :

#### Inscription
- [`format_user_registration()`](core/core/utils/format.py) : Confirmation utilisateur
- [`format_registration_email()`](core/core/utils/format.py) : Notification admin
- [`format_registration_accepted()`](core/core/utils/format.py) : Approbation
- [`format_registration_rejected()`](core/core/utils/format.py) : Rejet

#### Rendez-vous
- [`format_appointment_request()`](core/core/utils/format.py) : Nouvelle demande
- [`format_user_appointment_request()`](core/core/utils/format.py) : Confirmation patient
- [`format_appointment_confirmed()`](core/core/utils/format.py) : Confirmation
- [`format_appointment_cancelled()`](core/core/utils/format.py) : Annulation

### Intégration automatique

Les emails sont envoyés automatiquement lors :
- Inscription d'un nouveau dispensaire
- Demande de rendez-vous
- Changement de statut de rendez-vous
- Actions administratives

## 🔐 Permissions et sécurité

### Système de permissions

#### Base ([`care/permissions/base.py`](core/care/permissions/base.py))
- Permissions de base héritables

#### Dispensaires ([`care/permissions/dispensary.py`](core/care/permissions/dispensary.py))
- Contrôle d'accès aux dispensaires
- Vérification de propriété

#### Médecins ([`care/permissions/doctor.py`](core/care/permissions/doctor.py))
- [`CanDeleteDoctor`](core/care/permissions/doctor.py) : Suppression sécurisée
- [`IsOwnerOrChiefDoctor`](core/care/permissions/doctor.py) : Accès hiérarchique

### Authentification

- Token-based authentication personnalisée
- Middleware d'authentification automatique
- Sessions sécurisées

### Validation des données

- Sérialiseurs Django REST Framework
- Validation personnalisée dans [`care/serializers/`](core/care/serializers/)
- Contraintes base de données

## 🚀 Déploiement

### Configuration de production

1. **Variables d'environnement**
```bash
DEBUG=False
ALLOWED_HOSTS=votre-domaine.com
SECRET_KEY=nouvelle-clé-sécurisée
```

2. **Base de données**
```python
# Utiliser PostgreSQL en production
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'kmrcare_db',
        'USER': 'kmrcare_user',
        'PASSWORD': 'password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

3. **Fichiers statiques**
```bash
python manage.py collectstatic
```

### WebSockets (Production)

Configuration ASGI dans [`core/asgi.py`](core/core/asgi.py) :

```bash
# Déploiement avec Daphne
daphne core.asgi:application -p 8000

# Ou avec Uvicorn
uvicorn core.asgi:application --host 0.0.0.0 --port 8000
```

### Serveur de production

```bash
# Avec Gunicorn (HTTP uniquement)
gunicorn core.wsgi:application

# Avec Daphne (HTTP + WebSockets)
daphne core.asgi:application
```

## 📝 Développement

### Tests

```bash
# Tests unitaires
python manage.py test

# Tests spécifiques
python manage.py test account.tests
python manage.py test care.tests
```

### Migrations

```bash
# Créer des migrations
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate

# Voir l'état des migrations
python manage.py showmigrations
```

### Debugging

- Mode debug activé dans [`settings.py`](core/core/settings.py)
- Logs dans la console Django
- Interface d'administration : `/admin/`

## 🤝 Contribution

1. Fork du projet
2. Création d'une branche feature
3. Respect des conventions de code Django
4. Tests unitaires pour nouvelles fonctionnalités
5. Pull request avec description détaillée

## 📄 Licence

Ce projet est sous licence propriétaire. Tous droits réservés.

---

**KMRCare** - Un Rendez-vous, une solution 🏥