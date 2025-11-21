"""
Script para normalizar los valores del campo 'tipo' en la tabla notificaciones
Convierte todos los valores a mayúsculas para que coincidan con el enum TipoNotificacion
"""

from database import SessionLocal, engine
from sqlalchemy import text

def fix_notification_types():
    db = SessionLocal()
    
    try:
        print("Normalizando tipos de notificaciones...")
        print("-" * 60)
        
        # Actualizar cada tipo a mayúsculas
        updates = [
            ("mensaje", "MENSAJE"),
            ("sistema", "SISTEMA"),
            ("recordatorio", "RECORDATORIO"),
            ("cita_confirmada", "CITA_CONFIRMADA"),
            ("cita_cancelada", "CITA_CANCELADA"),
            ("cita_reagendada", "CITA_REAGENDADA"),
            ("pago_exitoso", "PAGO_EXITOSO"),
            ("pago_fallido", "PAGO_FALLIDO")
        ]
        
        total_updated = 0
        
        for old_value, new_value in updates:
            result = db.execute(
                text(f"UPDATE notificaciones SET tipo = :new_value WHERE tipo = :old_value"),
                {"old_value": old_value, "new_value": new_value}
            )
            count = result.rowcount
            if count > 0:
                print(f"✓ Actualizados {count} registros: '{old_value}' → '{new_value}'")
                total_updated += count
        
        db.commit()
        
        print("-" * 60)
        print(f"Total de registros actualizados: {total_updated}")
        print("\nVerificando resultados finales:")
        print("-" * 60)
        
        # Verificar el resultado
        result = db.execute(text("SELECT tipo, COUNT(*) as count FROM notificaciones GROUP BY tipo"))
        rows = result.fetchall()
        
        for row in rows:
            print(f"Tipo: '{row[0]}' - Cantidad: {row[1]}")
        
        print("\n✓ Migración completada exitosamente!")
        
    except Exception as e:
        print(f"\n✗ Error durante la migración: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    fix_notification_types()
