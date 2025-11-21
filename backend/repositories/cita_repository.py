"""
Repositorio para operaciones de citas
"""

from typing import Optional, List
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func

from models import Cita, EstadoCita, User


class CitaRepository:
    """Repositorio para gestionar citas"""
    
    @staticmethod
    def crear(db: Session, cita_data: dict) -> Cita:
        """Crea una nueva cita"""
        cita = Cita(**cita_data)
        db.add(cita)
        db.commit()
        db.refresh(cita)
        return cita
    
    @staticmethod
    def obtener_por_id(db: Session, cita_id: int) -> Optional[Cita]:
        """Obtiene una cita por ID"""
        return db.query(Cita).filter(Cita.id == cita_id).first()
    
    @staticmethod
    def obtener_por_cliente(
        db: Session,
        cliente_id: int,
        estado: Optional[EstadoCita] = None,
        fecha_desde: Optional[datetime] = None,
        fecha_hasta: Optional[datetime] = None
    ) -> List[Cita]:
        """Obtiene citas de un cliente con filtros"""
        query = db.query(Cita).filter(Cita.cliente_id == cliente_id)
        
        if estado:
            query = query.filter(Cita.estado == estado)
        
        if fecha_desde:
            query = query.filter(Cita.fecha_hora >= fecha_desde)
        
        if fecha_hasta:
            query = query.filter(Cita.fecha_hora <= fecha_hasta)
        
        return query.order_by(Cita.fecha_hora.desc()).all()
    
    @staticmethod
    def obtener_por_profesional(
        db: Session,
        profesional_id: int,
        estado: Optional[EstadoCita] = None,
        fecha_desde: Optional[datetime] = None,
        fecha_hasta: Optional[datetime] = None
    ) -> List[Cita]:
        """Obtiene citas de un profesional con filtros"""
        query = db.query(Cita).filter(Cita.profesional_id == profesional_id)
        
        if estado:
            query = query.filter(Cita.estado == estado)
        
        if fecha_desde:
            query = query.filter(Cita.fecha_hora >= fecha_desde)
        
        if fecha_hasta:
            query = query.filter(Cita.fecha_hora <= fecha_hasta)
        
        return query.order_by(Cita.fecha_hora.asc()).all()
    
    @staticmethod
    def obtener_proximas(
        db: Session,
        user_id: int,
        es_profesional: bool = False,
        limit: int = 5
    ) -> List[Cita]:
        """Obtiene próximas citas de un usuario"""
        ahora = datetime.now()
        
        if es_profesional:
            query = db.query(Cita).filter(Cita.profesional_id == user_id)
        else:
            query = db.query(Cita).filter(Cita.cliente_id == user_id)
        
        return query.filter(
            Cita.fecha_hora >= ahora,
            or_(
                Cita.estado == EstadoCita.CONFIRMADA,
                Cita.estado == EstadoCita.PENDIENTE
            )
        ).order_by(Cita.fecha_hora.asc()).limit(limit).all()
    
    @staticmethod
    def obtener_del_dia(
        db: Session,
        profesional_id: int,
        fecha: datetime
    ) -> List[Cita]:
        """Obtiene todas las citas de un día específico"""
        inicio_dia = fecha.replace(hour=0, minute=0, second=0, microsecond=0)
        fin_dia = inicio_dia + timedelta(days=1)
        
        return db.query(Cita).filter(
            Cita.profesional_id == profesional_id,
            Cita.fecha_hora >= inicio_dia,
            Cita.fecha_hora < fin_dia
        ).order_by(Cita.fecha_hora.asc()).all()
    
    @staticmethod
    def verificar_conflicto(
        db: Session,
        profesional_id: int,
        fecha_hora: datetime,
        duracion_minutos: int,
        excluir_cita_id: Optional[int] = None
    ) -> bool:
        """Verifica si hay conflicto de horario"""
        fin_cita = fecha_hora + timedelta(minutes=duracion_minutos)
        
        query = db.query(Cita).filter(
            Cita.profesional_id == profesional_id,
            Cita.estado.in_([EstadoCita.CONFIRMADA, EstadoCita.PENDIENTE]),
            Cita.fecha_hora < fin_cita,
            (Cita.fecha_hora + timedelta(minutes=Cita.duracion_minutos)) > fecha_hora
        )
        
        if excluir_cita_id:
            query = query.filter(Cita.id != excluir_cita_id)
        
        return query.first() is not None
    
    @staticmethod
    def actualizar_estado(
        db: Session,
        cita_id: int,
        nuevo_estado: EstadoCita
    ) -> Optional[Cita]:
        """Actualiza el estado de una cita"""
        cita = CitaRepository.obtener_por_id(db, cita_id)
        if not cita:
            return None
        
        cita.estado = nuevo_estado
        db.commit()
        db.refresh(cita)
        return cita
    
    @staticmethod
    def actualizar(db: Session, cita_id: int, **campos) -> Optional[Cita]:
        """Actualiza campos de una cita"""
        cita = CitaRepository.obtener_por_id(db, cita_id)
        if not cita:
            return None
        
        for campo, valor in campos.items():
            if hasattr(cita, campo):
                setattr(cita, campo, valor)
        
        db.commit()
        db.refresh(cita)
        return cita
    
    @staticmethod
    def cancelar(db: Session, cita_id: int, motivo: str = None) -> bool:
        """Cancela una cita"""
        cita = CitaRepository.obtener_por_id(db, cita_id)
        if not cita:
            return False
        
        cita.estado = EstadoCita.CANCELADA
        if motivo:
            cita.motivo_cancelacion = motivo
        
        db.commit()
        return True
    
    @staticmethod
    def contar_por_estado(
        db: Session,
        user_id: int,
        es_profesional: bool = False
    ) -> dict:
        """Cuenta citas agrupadas por estado"""
        if es_profesional:
            filtro = Cita.profesional_id == user_id
        else:
            filtro = Cita.cliente_id == user_id
        
        resultados = db.query(
            Cita.estado,
            func.count(Cita.id)
        ).filter(filtro).group_by(Cita.estado).all()
        
        return {estado.value: count for estado, count in resultados}
    
    @staticmethod
    def contar_total(
        db: Session,
        user_id: int,
        es_profesional: bool = False
    ) -> int:
        """Cuenta total de citas"""
        if es_profesional:
            filtro = Cita.profesional_id == user_id
        else:
            filtro = Cita.cliente_id == user_id
        
        return db.query(Cita).filter(filtro).count()
    
    @staticmethod
    def obtener_historial(
        db: Session,
        cliente_id: int,
        limit: int = 10
    ) -> List[Cita]:
        """Obtiene historial de citas pasadas de un cliente"""
        ahora = datetime.now()
        
        return db.query(Cita).filter(
            Cita.cliente_id == cliente_id,
            Cita.fecha_hora < ahora
        ).order_by(Cita.fecha_hora.desc()).limit(limit).all()
