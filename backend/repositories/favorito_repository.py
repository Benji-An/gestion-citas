"""
Repositorio para operaciones de favoritos
"""

from typing import List, Tuple, Optional
from sqlalchemy.orm import Session

from models import Favorito, User, PerfilProfesional


class FavoritoRepository:
    """Repositorio para gestionar favoritos"""
    
    @staticmethod
    def agregar(db: Session, cliente_id: int, profesional_id: int) -> Favorito:
        """Agrega un profesional a favoritos"""
        favorito = Favorito(
            cliente_id=cliente_id,
            profesional_id=profesional_id
        )
        db.add(favorito)
        db.commit()
        db.refresh(favorito)
        return favorito
    
    @staticmethod
    def eliminar(db: Session, cliente_id: int, profesional_id: int) -> bool:
        """Elimina un profesional de favoritos"""
        favorito = db.query(Favorito).filter(
            Favorito.cliente_id == cliente_id,
            Favorito.profesional_id == profesional_id
        ).first()
        
        if not favorito:
            return False
        
        db.delete(favorito)
        db.commit()
        return True
    
    @staticmethod
    def obtener_por_cliente(
        db: Session,
        cliente_id: int
    ) -> List[Tuple[Favorito, User, PerfilProfesional]]:
        """Obtiene todos los favoritos de un cliente con información completa"""
        return db.query(Favorito, User, PerfilProfesional).join(
            User, Favorito.profesional_id == User.id
        ).join(
            PerfilProfesional, User.id == PerfilProfesional.user_id
        ).filter(
            Favorito.cliente_id == cliente_id
        ).order_by(Favorito.created_at.desc()).all()
    
    @staticmethod
    def obtener_ids_favoritos(db: Session, cliente_id: int) -> List[int]:
        """Obtiene solo los IDs de profesionales favoritos"""
        favoritos = db.query(Favorito.profesional_id).filter(
            Favorito.cliente_id == cliente_id
        ).all()
        
        return [fav[0] for fav in favoritos]
    
    @staticmethod
    def es_favorito(db: Session, cliente_id: int, profesional_id: int) -> bool:
        """Verifica si un profesional es favorito"""
        return db.query(Favorito).filter(
            Favorito.cliente_id == cliente_id,
            Favorito.profesional_id == profesional_id
        ).first() is not None
    
    @staticmethod
    def contar_favoritos(db: Session, cliente_id: int) -> int:
        """Cuenta cuántos favoritos tiene un cliente"""
        return db.query(Favorito).filter(
            Favorito.cliente_id == cliente_id
        ).count()
    
    @staticmethod
    def contar_clientes_favorito(db: Session, profesional_id: int) -> int:
        """Cuenta cuántos clientes tienen a un profesional como favorito"""
        return db.query(Favorito).filter(
            Favorito.profesional_id == profesional_id
        ).count()
    
    @staticmethod
    def obtener_mas_populares(db: Session, limit: int = 10) -> List[dict]:
        """Obtiene los profesionales más populares (más agregados a favoritos)"""
        from sqlalchemy import func
        
        resultados = db.query(
            Favorito.profesional_id,
            func.count(Favorito.id).label('count')
        ).group_by(
            Favorito.profesional_id
        ).order_by(
            func.count(Favorito.id).desc()
        ).limit(limit).all()
        
        return [
            {'profesional_id': prof_id, 'favoritos_count': count}
            for prof_id, count in resultados
        ]
    
    @staticmethod
    def eliminar_por_cliente(db: Session, cliente_id: int) -> int:
        """Elimina todos los favoritos de un cliente"""
        count = db.query(Favorito).filter(
            Favorito.cliente_id == cliente_id
        ).delete()
        db.commit()
        return count
    
    @staticmethod
    def eliminar_por_profesional(db: Session, profesional_id: int) -> int:
        """Elimina todas las referencias de favoritos a un profesional"""
        count = db.query(Favorito).filter(
            Favorito.profesional_id == profesional_id
        ).delete()
        db.commit()
        return count
