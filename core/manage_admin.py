#!/usr/bin/env python
"""
Script pour diagnostiquer et créer un compte administrateur
"""
import os
import sys
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password

User = get_user_model()

def list_users():
    """Liste tous les utilisateurs et leurs permissions"""
    print("=== LISTE DES UTILISATEURS ===")
    users = User.objects.all()
    
    if not users.exists():
        print("Aucun utilisateur trouvé dans la base de données")
        return
    
    for user in users:
        print(f"Username: {user.username}")
        print(f"  Email: {user.email}")
        print(f"  Nom: {user.first_name} {user.last_name}")
        print(f"  is_active: {user.is_active}")
        print(f"  is_staff: {user.is_staff}")
        print(f"  is_superuser: {user.is_superuser}")
        print(f"  Date de création: {user.date_joined}")
        print("-" * 40)

def create_admin_user():
    """Crée un utilisateur administrateur"""
    print("\n=== CRÉATION D'UN COMPTE ADMINISTRATEUR ===")
    
    username = input("Nom d'utilisateur pour l'admin: ")
    email = input("Email pour l'admin: ")
    password = input("Mot de passe pour l'admin: ")
    first_name = input("Prénom (optionnel): ")
    last_name = input("Nom (optionnel): ")
    
    # Vérifier si l'utilisateur existe déjà
    if User.objects.filter(username=username).exists():
        print(f"❌ Un utilisateur avec le nom '{username}' existe déjà")
        return False
    
    if User.objects.filter(email=email).exists():
        print(f"❌ Un utilisateur avec l'email '{email}' existe déjà")
        return False
    
    try:
        # Créer l'utilisateur admin
        admin_user = User.objects.create(
            username=username,
            email=email,
            password=make_password(password),
            first_name=first_name,
            last_name=last_name,
            is_staff=True,
            is_superuser=True,
            is_active=True
        )
        
        print(f"✅ Utilisateur administrateur '{username}' créé avec succès!")
        print(f"   Email: {email}")
        print(f"   is_staff: {admin_user.is_staff}")
        print(f"   is_superuser: {admin_user.is_superuser}")
        return True
        
    except Exception as e:
        print(f"❌ Erreur lors de la création de l'admin: {e}")
        return False

def promote_user_to_admin():
    """Promouvoir un utilisateur existant en administrateur"""
    print("\n=== PROMOTION D'UN UTILISATEUR EN ADMINISTRATEUR ===")
    
    username = input("Nom d'utilisateur à promouvoir: ")
    
    try:
        user = User.objects.get(username=username)
        user.is_staff = True
        user.is_superuser = True
        user.save()
        
        print(f"✅ Utilisateur '{username}' promu en administrateur!")
        print(f"   is_staff: {user.is_staff}")
        print(f"   is_superuser: {user.is_superuser}")
        return True
        
    except User.DoesNotExist:
        print(f"❌ Utilisateur '{username}' introuvable")
        return False
    except Exception as e:
        print(f"❌ Erreur lors de la promotion: {e}")
        return False

def main():
    print("🔧 GESTIONNAIRE D'UTILISATEURS ADMINISTRATEURS")
    print("=" * 50)
    
    list_users()
    
    print("\nQue voulez-vous faire ?")
    print("1. Créer un nouvel utilisateur administrateur")
    print("2. Promouvoir un utilisateur existant en administrateur")
    print("3. Relister les utilisateurs")
    print("4. Quitter")
    
    choice = input("\nVotre choix (1-4): ")
    
    if choice == "1":
        create_admin_user()
    elif choice == "2":
        promote_user_to_admin()
    elif choice == "3":
        list_users()
    elif choice == "4":
        print("Au revoir!")
        return
    else:
        print("Choix invalide")
    
    # Relister les utilisateurs après modification
    if choice in ["1", "2"]:
        print("\n" + "=" * 50)
        list_users()

if __name__ == "__main__":
    main()
