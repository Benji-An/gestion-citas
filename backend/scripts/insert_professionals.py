"""Script para insertar profesionales de ejemplo en la base de datos.

Uso: desde la carpeta `backend` ejecutar:
    python scripts\insert_professionals.py

El script usa la función `get_connection` del proyecto (usa las mismas variables de entorno que tu backend).
Genera contraseñas hasheadas con bcrypt y tokens UUID.
"""
import sys
import os

# Ensure parent folder (backend/) is on sys.path so `from db import get_connection` works
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from db import get_connection
import bcrypt
import uuid

PROFESSIONALS = [
    { 'name': 'Dra. Andrea Ruiz', 'email': 'andrea.ruiz@example.com', 'specialty': 'Odontología', 'password': 'clave123' },
    { 'name': 'Dr. Carlos Mendoza', 'email': 'carlos.mendoza@example.com', 'specialty': 'Medicina General', 'password': 'clave123' },
    { 'name': 'Dra. Laura Gómez', 'email': 'laura.gomez@example.com', 'specialty': 'Psicología', 'password': 'clave123' },
    { 'name': 'Dr. Roberto Silva', 'email': 'roberto.silva@example.com', 'specialty': 'Fisioterapia', 'password': 'clave123' },
]


def insert_professionals():
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            for p in PROFESSIONALS:
                email = p['email']
                cur.execute('SELECT id FROM users WHERE email=%s', (email,))
                if cur.fetchone():
                    print(f"Omitido (ya existe): {email}")
                    continue
                # hash password
                pwd_hash = bcrypt.hashpw(p['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                token = uuid.uuid4().hex
                cur.execute('INSERT INTO users (name, email, specialty, password, role, api_token, created_at) VALUES (%s,%s,%s,%s,%s,%s,NOW())', (p['name'], email, p['specialty'], pwd_hash, 'profesional', token))
                user_id = cur.lastrowid
                print(f"Insertado: id={user_id} email={email} token={token}")
        conn.commit()
    finally:
        conn.close()


if __name__ == '__main__':
    insert_professionals()
    print('\nHecho. Verifica en la tabla users o usa /auth/professionals para comprobar los datos.')
