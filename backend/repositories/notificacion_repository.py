"""
Repositorio para operaciones de notificaciones
"""

from typing import Optional, List
from sqlalchemy.orm import Session
from datetime import datetime

from models import Notificacion, TipoNotificacion


class NotificacionRepository:
    """Repositorio para gestionar notificaciones"""
    
    @staticmethod
    def crear(db: Session, notificacion_data: dict) -> Notificacion:
        """Crea una nueva notificación"""
        notificacion = Notificacion(**notificacion_data)
        db.add(notificacion)
        db.commit()
        db.refresh(notificacion)
        return notificacion
    
    @staticmethod
    def obtener_por_id(db: Session, notificacion_id: int) -> Optional[Notificacion]:
        """Obtiene una notificación por ID"""
        return db.query(Notificacion).filter(
            Notificacion.id == notificacion_id
        ).first()
    
    @staticmethod
    def obtener_por_usuario(
        db: Session,
        user_id: int,
        solo_no_leidas: bool = False,
        limit: int = 50
    ) -> List[Notificacion]:
        """Obtiene notificaciones de un usuario"""
        query = db.query(Notificacion).filter(Notificacion.user_id == user_id)
        
        if solo_no_leidas:
            query = query.filter(Notificacion.leida == False)
        
        return query.order_by(Notificacion.created_at.desc()).limit(limit).all()
    
    @staticmethod
    def obtener_por_tipo(
        db: Session,
        user_id: int,
        tipo: TipoNotificacion
    ) -> List[Notificacion]:
        """Obtiene notificaciones de un tipo específico"""
        return db.query(Notificacion).filter(
            Notificacion.user_id == user_id,
            Notificacion.tipo == tipo
        ).order_by(Notificacion.created_at.desc()).all()
    
    @staticmethod
    def marcar_como_leida(db: Session, notificacion_id: int) -> bool:
        """Marca una notificación como leída"""
        notificacion = NotificacionRepository.obtener_por_id(db, notificacion_id)
        if not notificacion:
            return False
        
        notificacion.leida = True
        notificacion.fecha_lectura = datetime.now()
        db.commit()
        return True
    
    @staticmethod
    def marcar_todas_como_leidas(db: Session, user_id: int) -> int:
        """Marca todas las notificaciones de un usuario como leídas"""
        count = db.query(Notificacion).filter(
            Notificacion.user_id == user_id,
            Notificacion.leida == False
        ).update({
            'leida': True,
            'fecha_lectura': datetime.now()
        })
        db.commit()
        return count
    
    @staticmethod
    def eliminar(db: Session, notificacion_id: int) -> bool:
        """Elimina una notificación"""
        notificacion = NotificacionRepository.obtener_por_id(db, notificacion_id)
        if not notificacion:
            return False
        
        db.delete(notificacion)
        db.commit()
        return True
    
    @staticmethod
    def eliminar_antiguas(db: Session, dias: int = 30) -> int:
        """Elimina notificaciones antiguas (leídas)"""
        fecha_limite = datetime.now() - timedelta(days=dias)
        
        count = db.query(Notificacion).filter(
            Notificacion.leida == True,
            Notificacion.fecha_lectura < fecha_limite
        ).delete()
        db.commit()
        return count
    
    @staticmethod
    def contar_no_leidas(db: Session, user_id: int) -> int:
        """Cuenta notificaciones no leídas"""
        return db.query(Notificacion).filter(
            Notificacion.user_id == user_id,
            Notificacion.leida == False
        ).count()
    
    @staticmethod
    def existe_similar(
        db: Session,
        user_id: int,
        tipo: TipoNotificacion,
        mensaje: str,
        minutos: int = 5
    ) -> bool:
        """Verifica si existe una notificación similar reciente"""
        fecha_limite = datetime.now() - timedelta(minutes=minutos)
        
        return db.query(Notificacion).filter(
            Notificacion.user_id == user_id,
            Notificacion.tipo == tipo,
            Notificacion.mensaje == mensaje,
            Notificacion.created_at >= fecha_limite
        ).first() is not None


from datetime import timedelta  # Añadir import faltante
