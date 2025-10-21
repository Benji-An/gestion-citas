import sqlite3
import os
from contextlib import contextmanager

# Ruta por defecto: archivo gestion_citas.db en el mismo directorio que este archivo
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_FILENAME = os.environ.get("GESTION_CITAS_DB", "gestion_citas.db")
DATABASE_PATH = os.path.join(BASE_DIR, DATABASE_FILENAME)


def get_connection():
    """Establece y retorna una conexión a la base de datos SQLite.

    Usa `DATABASE_PATH` (por defecto: backend/db/gestion_citas.db). Se puede
    sobrescribir con la variable de entorno `GESTION_CITAS_DB` si se desea.
    """
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row  # Para obtener resultados tipo dict/Row
    return conn


@contextmanager
def get_db_connection():
    """Context manager que entrega una conexión SQLite y la cierra automáticamente."""
    conn = get_connection()
    try:
        yield conn
    finally:
        conn.close()


class PDO:
    """Clase ligera para operaciones con la DB. Soporta `with PDO() as pdo:`."""
    def __init__(self):
        self.conn = get_connection()
        self.cursor = self.conn.cursor()

    def execute(self, query, params=None):
        if params is None:
            params = ()
        self.cursor.execute(query, params)
        self.conn.commit()
        return self.cursor

    def fetchall(self, query, params=None):
        if params is None:
            params = ()
        self.cursor.execute(query, params)
        return self.cursor.fetchall()

    def fetchone(self, query, params=None):
        if params is None:
            params = ()
        self.cursor.execute(query, params)
        return self.cursor.fetchone()

    def close(self):
        try:
            self.cursor.close()
        except Exception:
            pass
        try:
            self.conn.close()
        except Exception:
            pass

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        self.close()