from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
import bcrypt

from db import get_connection

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'usuario')

    if not all([name, email, password]):
        return jsonify({'error': 'name, email and password required'}), 422

    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute('SELECT id FROM users WHERE email=%s', (email,))
            if cur.fetchone():
                return jsonify({'error': 'Email already registered'}), 409

            pwd_hash = generate_password_hash(password)
            token = uuid.uuid4().hex
            cur.execute('INSERT INTO users (name, email, password, role, api_token, created_at) VALUES (%s,%s,%s,%s,%s,NOW())', (name, email, pwd_hash, role, token))
            user_id = cur.lastrowid
            return jsonify({'success': True, 'user': {'id': user_id, 'name': name, 'email': email, 'role': role}, 'token': token})
    finally:
        conn.close()


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({'error': 'email and password required'}), 422

    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute('SELECT id, name, password, role, api_token FROM users WHERE email=%s', (email,))
            user = cur.fetchone()
            if not user:
                return jsonify({'error': 'Invalid credentials'}), 401

            stored = user.get('password') or ''
            valid = False
            try:
                # Try werkzeug check (for hashes created by generate_password_hash)
                valid = check_password_hash(stored, password)
            except Exception:
                valid = False

            # Fallback: if stored looks like PHP bcrypt ($2y$ or $2b$), use bcrypt
            if not valid and stored.startswith('$2'):
                try:
                    # bcrypt expects bytes
                    valid = bcrypt.checkpw(password.encode('utf-8'), stored.encode('utf-8'))
                except Exception:
                    valid = False

            if not valid:
                return jsonify({'error': 'Invalid credentials'}), 401

            # return user without password
            user.pop('password', None)
            return jsonify({'success': True, 'user': user})
    finally:
        conn.close()
