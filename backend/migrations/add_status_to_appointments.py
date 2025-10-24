from db import get_connection

CHECK_SQL = "SELECT COUNT(*) as cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'appointments' AND COLUMN_NAME = 'status'"
ALTER_SQL = "ALTER TABLE appointments ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'proximas'"

if __name__ == '__main__':
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(CHECK_SQL)
            row = cur.fetchone()
            if row and row.get('cnt', 0) > 0:
                print('La columna status ya existe en appointments.')
            else:
                print('Agregando columna status a appointments...')
                cur.execute(ALTER_SQL)
                conn.commit()
                print('Columna status añadida satisfactoriamente.')
    finally:
        conn.close()
