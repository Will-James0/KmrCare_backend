#!/usr/bin/env python
"""
Script de debug pour tester l'endpoint /auth/register/owner/
"""
import requests
import json

# URL de l'endpoint
url = "http://localhost:8000/auth/register/owner/"

# Données de test complètes
test_data = {
    "first_name": "Jean",
    "last_name": "Dupont",
    "email": "jean.dupont@example.com",
    "username": "jean_dupont",
    "password": "motdepasse123",
    "phone": "+33123456789",
    "dispensary_name": "Pharmacie du Centre",
    "dispensary_specialities": "Médecine générale, Pédiatrie",
    "dispensary_quarter": "Centre-ville",
    "dispensary_localisation": "123 Rue de la Paix, 75001 Paris",
    "dispensary_phone": "+33123456790",
    "dispensary_email": "contact@pharmacieducentre.com",
    "dispensary_opening": "08:00",
    "dispensary_ending": "18:00"
}

print("=== Test de l'endpoint /auth/register/owner/ ===")
print(f"URL: {url}")
print(f"Données envoyées:")
print(json.dumps(test_data, indent=2, ensure_ascii=False))
print("\n" + "="*50)

try:
    response = requests.post(url, json=test_data)
    
    print(f"Code de statut: {response.status_code}")
    print(f"Headers de réponse: {dict(response.headers)}")
    
    try:
        response_data = response.json()
        print(f"Réponse JSON:")
        print(json.dumps(response_data, indent=2, ensure_ascii=False))
    except:
        print(f"Réponse brute: {response.text}")
        
except Exception as e:
    print(f"Erreur lors de la requête: {e}")
    
print("\n" + "="*50)
print("=== Suggestions de debug ===")
print("1. Vérifiez les logs du serveur Django")
print("2. Vérifiez que tous les champs requis sont présents")
print("3. Vérifiez les contraintes d'unicité (email, username, dispensary_name)")
print("4. Vérifiez le format des données (dates, emails, etc.)")
