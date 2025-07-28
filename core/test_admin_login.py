#!/usr/bin/env python
"""
Script de test pour l'endpoint /auth/login/admin/
"""
import requests
import json

def test_admin_login():
    url = "http://localhost:8000/auth/login/admin/"
    
    print("=== TEST DE CONNEXION ADMINISTRATEUR ===")
    print(f"URL: {url}")
    
    # Demander les identifiants
    username = input("Nom d'utilisateur ou email: ")
    password = input("Mot de passe: ")
    
    test_data = {
        "username": username,
        "password": password
    }
    
    print(f"\nDonnées envoyées:")
    print(json.dumps(test_data, indent=2, ensure_ascii=False))
    print("\n" + "="*50)
    
    try:
        response = requests.post(url, json=test_data)
        
        print(f"Code de statut: {response.status_code}")
        
        try:
            response_data = response.json()
            print(f"Réponse JSON:")
            print(json.dumps(response_data, indent=2, ensure_ascii=False))
            
            if response.status_code == 200:
                print("\n✅ CONNEXION RÉUSSIE!")
                user_data = response_data.get('user', {})
                print(f"Utilisateur: {user_data.get('username')}")
                print(f"is_staff: {user_data.get('is_staff')}")
                print(f"is_superuser: {user_data.get('is_superuser')}")
            elif response.status_code == 403:
                print("\n❌ ACCÈS REFUSÉ - L'utilisateur n'a pas les permissions d'administrateur")
            elif response.status_code == 400:
                print("\n❌ DONNÉES INVALIDES - Vérifiez les identifiants")
            else:
                print(f"\n❌ ERREUR {response.status_code}")
                
        except:
            print(f"Réponse brute: {response.text}")
            
    except Exception as e:
        print(f"Erreur lors de la requête: {e}")
    
    print("\n" + "="*50)
    print("=== SOLUTIONS POSSIBLES ===")
    print("1. Vérifiez que l'utilisateur existe")
    print("2. Vérifiez que l'utilisateur a is_staff=True ou is_superuser=True")
    print("3. Utilisez le script manage_admin.py pour créer/promouvoir un admin")
    print("4. Vérifiez les logs du serveur Django")

if __name__ == "__main__":
    test_admin_login()
