"""
Script para probar el endpoint de notificaciones
"""
import requests
import json

BASE_URL = "http://localhost:8000"

print("🔐 Iniciando sesión...")
login_response = requests.post(
    f"{BASE_URL}/api/auth/login",
    json={
        "email": "juan.perez@gmail.com",
        "password": "juan123"
    }
)

if login_response.status_code != 200:
    print(f"❌ Error en login: {login_response.status_code}")
    print(login_response.text)
    exit(1)

token = login_response.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}
print("✅ Login exitoso\n")

print("📬 Obteniendo notificaciones...")
notif_response = requests.get(
    f"{BASE_URL}/api/notificaciones/mis-notificaciones",
    headers=headers
)

print(f"Status Code: {notif_response.status_code}")

if notif_response.status_code == 200:
    data = notif_response.json()
    print(f"✅ Notificaciones recibidas: {len(data) if isinstance(data, list) else 'Error'}")
    
    if isinstance(data, list) and len(data) > 0:
        print("\n📋 Primera notificación:")
        print(json.dumps(data[0], indent=2, default=str))
        
        print("\n📋 Todas las notificaciones:")
        for i, notif in enumerate(data, 1):
            leida = "✅" if notif.get('leida') else "📬"
            print(f"{leida} {i}. [{notif.get('tipo')}] {notif.get('titulo')}")
    else:
        print("⚠️ No hay notificaciones")
else:
    print(f"❌ Error: {notif_response.status_code}")
    print(notif_response.text)
