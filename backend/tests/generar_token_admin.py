import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from security import create_access_token

# Crear token para admin
token = create_access_token(data={"sub": "admin@tiiwa.com"})
print(f"Token de admin:\n{token}")
print("\n\nPara probar el endpoint, usa este comando:")
print(f'\ncurl -X GET "http://localhost:8000/api/citas/admin/todas" -H "Authorization: Bearer {token}"')
