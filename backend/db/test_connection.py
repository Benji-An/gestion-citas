"""Script de prueba para verificar la conexión a la base de datos SQLite.

Ejecuta: python backend/db/test_connection.py
"""
try:
    from db.config import get_db_connection, DATABASE_PATH
except Exception:
    # Permitir ejecución directa del script: añadir la carpeta padre al path
    import os
    import sys

    HERE = os.path.dirname(os.path.abspath(__file__))
    ROOT = os.path.dirname(HERE)  # backend
    if ROOT not in sys.path:
        sys.path.insert(0, ROOT)
    from db.config import get_db_connection, DATABASE_PATH


def main():
    print("Usando archivo de base de datos:", DATABASE_PATH)
    with get_db_connection() as conn:
        cur = conn.cursor()
        cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cur.fetchall()
        if not tables:
            print("No se encontraron tablas (la base de datos puede estar vacía).")
        else:
            print("Tablas encontradas:")
            for t in tables:
                # t puede ser sqlite3.Row o tupla
                name = t[0] if isinstance(t, (tuple, list)) else list(t)[0]
                print(" -", name)


if __name__ == '__main__':
    main()
