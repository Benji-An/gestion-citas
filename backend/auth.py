from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
import uuid
import bcrypt
from functools import wraps
from flask import request, jsonify, g

from db import get_connection

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'usuario')
    specialty = data.get('specialty')

    if not all([name, email, password]):
        return jsonify({'error': 'name, email and password required'}), 422

    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute('SELECT id FROM users WHERE email=%s', (email,))
            if cur.fetchone():
                return jsonify({'error': 'Email already registered'}), 409

            # Hash password with bcrypt for compatibility with PHP bcrypt hashes
            pwd_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            token = uuid.uuid4().hex
            cur.execute('INSERT INTO users (name, email, specialty, password, role, api_token, created_at) VALUES (%s,%s,%s,%s,%s,%s,NOW())', (name, email, specialty, pwd_hash, role, token))
            user_id = cur.lastrowid
            return jsonify({'success': True, 'user': {'id': user_id, 'name': name, 'email': email, 'role': role, 'specialty': specialty}, 'token': token})
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
            cur.execute('SELECT id, name, password, role, api_token, specialty FROM users WHERE email=%s', (email,))
            user = cur.fetchone()
            if not user:
                return jsonify({'error': 'Invalid credentials'}), 401

            stored = user.get('password') or ''
            valid = False
            # First try bcrypt (most compatible with PHP hashes and our register)
            try:
                if stored.startswith('$2'):
                    valid = bcrypt.checkpw(password.encode('utf-8'), stored.encode('utf-8'))
            except Exception:
                valid = False

            # Fallback: older werkzeug hash formats
            if not valid:
                try:
                    valid = check_password_hash(stored, password)
                except Exception:
                    valid = False

            if not valid:
                return jsonify({'error': 'Invalid credentials'}), 401

            # return user without password
            user.pop('password', None)
            return jsonify({'success': True, 'user': user})
    finally:
        conn.close()


def get_user_by_token(token):
    if not token:
        return None
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute('SELECT id, name, email, role, api_token, specialty FROM users WHERE api_token=%s', (token,))
            return cur.fetchone()
    finally:
        conn.close()


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        token = None
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ', 1)[1].strip()
        if not token:
            token = request.args.get('token')
        if not token:
            return jsonify({'error': 'Token missing'}), 401
        user = get_user_by_token(token)
        if not user:
            return jsonify({'error': 'Invalid token'}), 401
        g.current_user = user
        return f(*args, **kwargs)
    return decorated


@auth_bp.route('/me', methods=['GET'])
@token_required
def me():
    user = getattr(g, 'current_user', None)
    if not user:
        return jsonify({'error': 'Not authenticated'}), 401
    return jsonify({'success': True, 'user': user})


@auth_bp.route('/me', methods=['PUT'])
@token_required
def update_me():
    user = getattr(g, 'current_user', None)
    if not user:
        return jsonify({'error': 'Not authenticated'}), 401
    data = request.get_json() or {}
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    specialty = data.get('specialty')

    conn = get_connection()
    try:
        with conn.cursor() as cur:
            # If email changed, ensure it's not used
            if email and email != user.get('email'):
                cur.execute('SELECT id FROM users WHERE email=%s', (email,))
                if cur.fetchone():
                    return jsonify({'error': 'Email already in use'}), 409

            updates = []
            params = []
            if name:
                updates.append('name=%s')
                params.append(name)
            if email:
                updates.append('email=%s')
                params.append(email)
            if password:
                # hash with bcrypt
                pwd_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                updates.append('password=%s')
                params.append(pwd_hash)
            if specialty is not None:
                updates.append('specialty=%s')
                params.append(specialty)
            if not updates:
                return jsonify({'success': True, 'user': user})
            params.append(user.get('id'))
            sql = 'UPDATE users SET ' + ', '.join(updates) + ' WHERE id=%s'
            cur.execute(sql, params)
            # return updated user
            cur.execute('SELECT id, name, email, role, api_token, specialty FROM users WHERE id=%s', (user.get('id'),))
            updated = cur.fetchone()
            return jsonify({'success': True, 'user': updated})
    finally:
        conn.close()


@auth_bp.route('/professionals', methods=['GET'])
def professionals():
    """Return list of users with role 'profesional'"""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id, name, email, role, specialty FROM users WHERE role=%s", ('profesional',))
            rows = cur.fetchall()
            # Map to simple structure; frontend may add details client-side
            result = []
            for r in rows:
                result.append({'id': r.get('id'), 'name': r.get('name'), 'email': r.get('email'), 'role': r.get('role'), 'specialty': r.get('specialty')})
            return jsonify({'success': True, 'data': result})
    finally:
        conn.close()
