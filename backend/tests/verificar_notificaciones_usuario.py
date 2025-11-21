"""
Script para verificar notificaciones de un usuario específico
"""
from database import SessionLocal
from models import User, Notificacion

db = SessionLocal()

try:
    # Buscar usuario
    user = db.query(User).filter(User.email == 'juan.perez@gmail.com').first()
    
    if not user:
        print('❌ Usuario juan.perez@gmail.com no encontrado')
    else:
        print(f'\n✅ Usuario: {user.nombre} {user.apellido}')
        print(f'   ID: {user.id}')
        print(f'   Email: {user.email}')
        
        # Buscar notificaciones
        notifs = db.query(Notificacion).filter(
            Notificacion.usuario_id == user.id
        ).order_by(Notificacion.created_at.desc()).all()
        
        print(f'\n📬 Total de notificaciones: {len(notifs)}')
        
        if notifs:
            print('\nÚltimas notificaciones:')
            for n in notifs[:10]:
                leida = '✅' if n.leida else '📬'
                print(f'{leida} [{n.id}] {n.tipo} - {n.titulo}')
                print(f'   {n.mensaje}')
                print(f'   Fecha: {n.created_at}')
                print()
        else:
            print('\n⚠️ No hay notificaciones para este usuario')
            print('   Ejecuta: python crear_notificaciones_prueba.py')
            
finally:
    db.close()
