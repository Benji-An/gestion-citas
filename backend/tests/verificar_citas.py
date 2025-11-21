import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from database import SessionLocal
from models import Cita, User

db = SessionLocal()

try:
    citas = db.query(Cita).all()
    print(f"📊 Total de citas en la base de datos: {len(citas)}")
    print()
    
    if len(citas) == 0:
        print("⚠️  No hay citas registradas")
    else:
        for cita in citas:
            cliente = db.query(User).filter(User.id == cita.cliente_id).first()
            profesional = db.query(User).filter(User.id == cita.profesional_id).first()
            
            print(f"🔹 Cita ID: {cita.id}")
            print(f"   Cliente: {cliente.nombre} {cliente.apellido} (ID: {cita.cliente_id})")
            print(f"   Profesional: {profesional.nombre} {profesional.apellido} (ID: {cita.profesional_id})")
            print(f"   Estado: {cita.estado.name}")
            print(f"   Fecha: {cita.fecha_hora}")
            print(f"   Precio: ${cita.precio}")
            print()
            
finally:
    db.close()
