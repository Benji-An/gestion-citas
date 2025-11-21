"""
Script para probar que el endpoint de notificaciones funcione correctamente
después de arreglar el problema de los tipos enum
"""
from database import SessionLocal
from models import User, Notificacion, TipoNotificacion
from sqlalchemy.orm import Session

def test_lectura_notificaciones():
    db = SessionLocal()
    
    try:
        print("=" * 60)
        print("🔍 PROBANDO LECTURA DE NOTIFICACIONES")
        print("=" * 60)
        print()
        
        # Obtener usuario
        usuario = db.query(User).filter(User.email == "juan.perez@gmail.com").first()
        
        if not usuario:
            print("❌ Usuario no encontrado")
            return
        
        print(f"✅ Usuario: {usuario.nombre} {usuario.apellido} (ID: {usuario.id})")
        print()
        
        # Intentar leer las notificaciones (esto era lo que fallaba)
        notificaciones = db.query(Notificacion).filter(
            Notificacion.usuario_id == usuario.id
        ).order_by(Notificacion.created_at.desc()).limit(10).all()
        
        print(f"📬 Total de notificaciones encontradas: {len(notificaciones)}")
        print()
        
        if notificaciones:
            print("Primeras notificaciones:")
            print("-" * 60)
            for n in notificaciones[:5]:
                tipo_icon = {
                    TipoNotificacion.SISTEMA: "⚙️",
                    TipoNotificacion.MENSAJE: "💬",
                    TipoNotificacion.RECORDATORIO: "⏰",
                    TipoNotificacion.CITA_CONFIRMADA: "📅",
                    TipoNotificacion.CITA_CANCELADA: "❌",
                    TipoNotificacion.CITA_REAGENDADA: "🔄",
                    TipoNotificacion.PAGO_EXITOSO: "💰",
                    TipoNotificacion.PAGO_FALLIDO: "⚠️"
                }
                icon = tipo_icon.get(n.tipo, "📬")
                estado = "✅ Leída" if n.leida else "🔔 No leída"
                
                print(f"{icon} [{estado}] {n.titulo}")
                print(f"   Tipo: {n.tipo.value} ({type(n.tipo).__name__})")
                print(f"   Mensaje: {n.mensaje[:50]}...")
                print(f"   ID: {n.id} | Fecha: {n.created_at}")
                print()
        
        print("=" * 60)
        print("✅ PRUEBA EXITOSA: Las notificaciones se leen correctamente")
        print("=" * 60)
        print()
        print("El problema del enum ha sido resuelto.")
        print("Ahora el endpoint /api/notificaciones/mis-notificaciones debe funcionar.")
        print()
        
    except Exception as e:
        print(f"❌ Error al leer notificaciones: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_lectura_notificaciones()
