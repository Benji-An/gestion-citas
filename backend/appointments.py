from flask import Blueprint, request, jsonify
from db import get_connection

appointments_bp = Blueprint('appointments', __name__)


@appointments_bp.route('/create', methods=['POST'])
def create_appointment():
    data = request.get_json()
    user_id = data.get('user_id')
    professional_id = data.get('professional_id')
    date_time = data.get('date_time')
    notes = data.get('notes')

    if not all([user_id, professional_id, date_time]):
        return jsonify({'error': 'user_id, professional_id and date_time are required'}), 422

    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute('INSERT INTO appointments (user_id, professional_id, date_time, notes, created_at) VALUES (%s,%s,%s,%s,NOW())', (user_id, professional_id, date_time, notes))
            appointment_id = cur.lastrowid
            return jsonify({'success': True, 'appointment_id': appointment_id})
    finally:
        conn.close()


@appointments_bp.route('/list', methods=['GET'])
def list_appointments():
    user_id = request.args.get('user_id')
    professional_id = request.args.get('professional_id')

    query = 'SELECT a.*, u.name as user_name, p.name as professional_name FROM appointments a JOIN users u ON a.user_id = u.id JOIN users p ON a.professional_id = p.id'
    params = []
    conds = []
    if user_id:
        conds.append('a.user_id = %s')
        params.append(user_id)
    if professional_id:
        conds.append('a.professional_id = %s')
        params.append(professional_id)
    if conds:
        query += ' WHERE ' + ' AND '.join(conds)
    query += ' ORDER BY a.date_time ASC'

    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(query, params)
            rows = cur.fetchall()
            return jsonify({'success': True, 'data': rows})
    finally:
        conn.close()
