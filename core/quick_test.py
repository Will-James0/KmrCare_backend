import requests
import json

# Test rapide de connexion admin
url = "http://localhost:8000/auth/login/admin/"
data = {"username": "will", "password": "1"}

print(f"Test de connexion admin:")
print(f"URL: {url}")
print(f"Data: {data}")

try:
    response = requests.post(url, json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Erreur: {e}")
