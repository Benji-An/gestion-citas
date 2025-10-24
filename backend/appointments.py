from flask import Blueprint, request, jsonify
from db import get_connection
from auth import get_user_by_token
import datetime as dt
import decimal

appointments_bp = Blueprint('appointments', __name__)


@appointments_bp.route('/create', methods=['POST'])
def create_appointment():
    data = request.get_json()
    user_id = data.get('user_id')
    professional_id = data.get('professional_id')
    date_time = data.get('date_time')
    notes = data.get('notes')

    # If Authorization header present, try to extract user from token
    auth_header = request.headers.get('Authorization', '')
    if auth_header.startswith('Bearer ') and not user_id:
        token = auth_header.split(' ', 1)[1].strip()
        user = get_user_by_token(token)
        if user:
            user_id = user.get('id')

    # date_time is optional now (frontend may send only a request without scheduled date/time)
    if not user_id or not professional_id:
        return jsonify({'error': 'user_id and professional_id are required'}), 422

    conn = get_connection()
    try:
        with conn.cursor() as cur:
            # allow date_time to be NULL if not provided
            cur.execute('INSERT INTO appointments (user_id, professional_id, date_time, notes, created_at) VALUES (%s,%s,%s,%s,NOW())', (user_id, professional_id, date_time if date_time else None, notes))
            appointment_id = cur.lastrowid
            return jsonify({'success': True, 'appointment_id': appointment_id})
    finally:
        conn.close()


@appointments_bp.route('/reschedule', methods=['POST'])
def reschedule_appointment():
    data = request.get_json() or {}
    appointment_id = data.get('appointment_id')
    new_date_time = data.get('date_time')

    if not appointment_id or not new_date_time:
        return jsonify({'error': 'appointment_id and date_time are required'}), 422

    # try to get user from token if present
    user_id = data.get('user_id')
    auth_header = request.headers.get('Authorization', '')
    if auth_header.startswith('Bearer ') and not user_id:
        token = auth_header.split(' ', 1)[1].strip()
        user = get_user_by_token(token)
        if user:
            user_id = user.get('id')

    conn = get_connection()
    try:
        with conn.cursor() as cur:
            # Verify appointment belongs to the user (if user_id available)
            if user_id:
                cur.execute('SELECT user_id FROM appointments WHERE id = %s', (appointment_id,))
                row = cur.fetchone()
                if not row:
                    return jsonify({'error': 'Appointment not found'}), 404
                if int(row.get('user_id')) != int(user_id):
                    return jsonify({'error': 'No permission to modify this appointment'}), 403

            cur.execute('UPDATE appointments SET date_time = %s, status = %s WHERE id = %s', (new_date_time, 'proximas', appointment_id))
            conn.commit()
            return jsonify({'success': True, 'appointment_id': appointment_id})
    finally:
        conn.close()


@appointments_bp.route('/cancel', methods=['POST'])
def cancel_appointment():
    data = request.get_json() or {}
    appointment_id = data.get('appointment_id')

    if not appointment_id:
        return jsonify({'error': 'appointment_id is required'}), 422

    # try to get user from token if present
    user_id = data.get('user_id')
    auth_header = request.headers.get('Authorization', '')
    if auth_header.startswith('Bearer ') and not user_id:
        token = auth_header.split(' ', 1)[1].strip()
        user = get_user_by_token(token)
        if user:
            user_id = user.get('id')

    conn = get_connection()
    try:
        with conn.cursor() as cur:
            # Verify ownership if possible
            if user_id:
                cur.execute('SELECT user_id FROM appointments WHERE id = %s', (appointment_id,))
                row = cur.fetchone()
                if not row:
                    return jsonify({'error': 'Appointment not found'}), 404
                if int(row.get('user_id')) != int(user_id):
                    return jsonify({'error': 'No permission to cancel this appointment'}), 403

            cur.execute('UPDATE appointments SET status = %s WHERE id = %s', ('canceladas', appointment_id))
            conn.commit()
            return jsonify({'success': True, 'appointment_id': appointment_id})
    finally:
        conn.close()


@appointments_bp.route('/list', methods=['GET'])
def list_appointments():
    user_id = request.args.get('user_id')
    professional_id = request.args.get('professional_id')

    # Return standardized date fields (ISO strings) and simple date/time parts to make frontend parsing reliable
    query = '''SELECT a.*,
        u.name as user_name,
        p.name as professional_name,
        p.specialty as professional_specialty,
        DATE_FORMAT(a.date_time, '%%Y-%%m-%%dT%%H:%%i:%%s') as date_time_iso,
        DATE(a.date_time) as date_only,
        TIME(a.date_time) as time_only,
        DATE_FORMAT(a.created_at, '%%Y-%%m-%%dT%%H:%%i:%%s') as created_at_iso
        FROM appointments a
        JOIN users u ON a.user_id = u.id
        JOIN users p ON a.professional_id = p.id'''
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
            # normalize returned rows: map professional_specialty -> specialty and expose ISO/date parts
            for r in rows:
                if 'professional_specialty' in r:
                    r['specialty'] = r.get('professional_specialty')
                # prefer the ISO formatted field if available
                if 'date_time_iso' in r and r.get('date_time_iso'):
                    r['date_time'] = r.get('date_time_iso')
                elif r.get('date_time'):
                    # leave existing value
                    pass
                # add created_at normalized
                if 'created_at_iso' in r and r.get('created_at_iso'):
                    r['created_at'] = r.get('created_at_iso')

                # Ensure all values are JSON-serializable: convert dates, datetimes, times, timedeltas, Decimals to strings
                for k, v in list(r.items()):
                    if isinstance(v, dt.datetime):
                        # ISO format for datetimes
                        r[k] = v.isoformat(sep='T')
                    elif isinstance(v, dt.date):
                        r[k] = v.isoformat()
                    elif isinstance(v, dt.time):
                        # time may be returned as datetime.time
                        try:
                            r[k] = v.strftime('%H:%M:%S')
                        except Exception:
                            r[k] = str(v)
                    elif isinstance(v, dt.timedelta):
                        # MySQL TIME may be mapped to timedelta by some drivers
                        r[k] = str(v)
                    elif isinstance(v, decimal.Decimal):
                        r[k] = str(v)

            return jsonify({'success': True, 'data': rows})
    finally:
        conn.close()
