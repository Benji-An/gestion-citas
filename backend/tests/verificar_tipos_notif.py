from database import SessionLocal, engine
from sqlalchemy import text

db = SessionLocal()

# Consulta SQL directa para ver los valores reales
result = db.execute(text("SELECT id, tipo FROM notificaciones LIMIT 10"))
rows = result.fetchall()

print("Valores actuales en la base de datos:")
print("-" * 50)
for row in rows:
    print(f"ID: {row[0]}, Tipo: '{row[1]}'")

# Contar por tipo
result = db.execute(text("SELECT tipo, COUNT(*) as count FROM notificaciones GROUP BY tipo"))
rows = result.fetchall()

print("\n\nDistribución de tipos:")
print("-" * 50)
for row in rows:
    print(f"Tipo: '{row[0]}' - Cantidad: {row[1]}")

db.close()
