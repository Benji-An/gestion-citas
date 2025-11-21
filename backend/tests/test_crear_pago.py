"""
Script para probar el endpoint de crear pago PayPal
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import SessionLocal
from models import User, Cita, TipoUsuario
from datetime import datetime

def test_crear_pago():
    db = SessionLocal()
    
    try:
        # Buscar un cliente
        cliente = db.query(User).filter(
            User.tipo_usuario == TipoUsuario.CLIENTE
        ).first()
        
        if not cliente:
            print("❌ No hay clientes en la base de datos")
            return
        
        print(f"✅ Cliente encontrado: {cliente.email} (ID: {cliente.id})")
        
        # Buscar una cita del cliente
        cita = db.query(Cita).filter(
            Cita.cliente_id == cliente.id
        ).first()
        
        if not cita:
            print("❌ El cliente no tiene citas")
            return
        
        print(f"✅ Cita encontrada: ID={cita.id}")
        print(f"   - Profesional ID: {cita.profesional_id}")
        print(f"   - Fecha: {cita.fecha_hora}")
        print(f"   - Precio: {cita.precio}")
        print(f"   - Estado: {cita.estado}")
        
        if cita.precio is None:
            print("\n❌ ERROR: La cita no tiene precio asignado!")
            print("   Esto causará un error al intentar crear el pago")
        else:
            print(f"\n✅ Precio válido: ${cita.precio:,} COP")
            monto_usd = round(cita.precio / 4000, 2)
            print(f"   Equivalente en USD: ${monto_usd}")
        
    finally:
        db.close()

if __name__ == "__main__":
    print("=" * 60)
    print("TEST: Crear pago PayPal")
    print("=" * 60)
    test_crear_pago()
