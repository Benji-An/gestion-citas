from db import get_connection

CHECK_SQL = "SELECT COUNT(*) as cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'specialty'"
ALTER_SQL = "ALTER TABLE users ADD COLUMN specialty VARCHAR(150) DEFAULT NULL"

if __name__ == '__main__':
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(CHECK_SQL)
            row = cur.fetchone()
            if row and row.get('cnt', 0) > 0:
                print('La columna specialty ya existe en users.')
            else:
                print('Agregando columna specialty a users...')
                cur.execute(ALTER_SQL)
                print('Columna specialty añadida satisfactoriamente.')
                conn.commit()
    finally:
        conn.close()
