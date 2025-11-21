"""
Repositorio para operaciones de pagos
"""

from typing import Optional, List
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func, and_

from models import Pago, EstadoPago, Cita


class PagoRepository:
    """Repositorio para gestionar pagos"""
    
    @staticmethod
    def crear(db: Session, pago_data: dict) -> Pago:
        """Crea un nuevo pago"""
        pago = Pago(**pago_data)
        db.add(pago)
        db.commit()
        db.refresh(pago)
        return pago
    
    @staticmethod
    def obtener_por_id(db: Session, pago_id: int) -> Optional[Pago]:
        """Obtiene un pago por ID"""
        return db.query(Pago).filter(Pago.id == pago_id).first()
    
    @staticmethod
    def obtener_por_cita(db: Session, cita_id: int) -> Optional[Pago]:
        """Obtiene el pago asociado a una cita"""
        return db.query(Pago).filter(Pago.cita_id == cita_id).first()
    
    @staticmethod
    def obtener_por_transaccion(
        db: Session, 
        transaccion_id: str
    ) -> Optional[Pago]:
        """Obtiene un pago por ID de transacción"""
        return db.query(Pago).filter(
            Pago.transaccion_id == transaccion_id
        ).first()
    
    @staticmethod
    def obtener_por_cliente(
        db: Session,
        cliente_id: int,
        estado: Optional[EstadoPago] = None
    ) -> List[Pago]:
        """Obtiene pagos de un cliente"""
        query = db.query(Pago).join(Cita).filter(Cita.cliente_id == cliente_id)
        
        if estado:
            query = query.filter(Pago.estado == estado)
        
        return query.order_by(Pago.created_at.desc()).all()
    
    @staticmethod
    def obtener_por_profesional(
        db: Session,
        profesional_id: int,
        estado: Optional[EstadoPago] = None
    ) -> List[Pago]:
        """Obtiene pagos de un profesional"""
        query = db.query(Pago).join(Cita).filter(
            Cita.profesional_id == profesional_id
        )
        
        if estado:
            query = query.filter(Pago.estado == estado)
        
        return query.order_by(Pago.created_at.desc()).all()
    
    @staticmethod
    def actualizar_estado(
        db: Session,
        pago_id: int,
        nuevo_estado: EstadoPago
    ) -> Optional[Pago]:
        """Actualiza el estado de un pago"""
        pago = PagoRepository.obtener_por_id(db, pago_id)
        if not pago:
            return None
        
        pago.estado = nuevo_estado
        db.commit()
        db.refresh(pago)
        return pago
    
    @staticmethod
    def actualizar(db: Session, pago_id: int, **campos) -> Optional[Pago]:
        """Actualiza campos de un pago"""
        pago = PagoRepository.obtener_por_id(db, pago_id)
        if not pago:
            return None
        
        for campo, valor in campos.items():
            if hasattr(pago, campo):
                setattr(pago, campo, valor)
        
        db.commit()
        db.refresh(pago)
        return pago
    
    @staticmethod
    def calcular_ingresos_profesional(
        db: Session,
        profesional_id: int,
        fecha_desde: Optional[datetime] = None,
        fecha_hasta: Optional[datetime] = None
    ) -> float:
        """Calcula ingresos totales de un profesional"""
        query = db.query(func.sum(Pago.monto)).join(Cita).filter(
            Cita.profesional_id == profesional_id,
            Pago.estado == EstadoPago.COMPLETADO
        )
        
        if fecha_desde:
            query = query.filter(Pago.created_at >= fecha_desde)
        
        if fecha_hasta:
            query = query.filter(Pago.created_at <= fecha_hasta)
        
        resultado = query.scalar()
        return float(resultado) if resultado else 0.0
    
    @staticmethod
    def calcular_gastos_cliente(
        db: Session,
        cliente_id: int,
        fecha_desde: Optional[datetime] = None,
        fecha_hasta: Optional[datetime] = None
    ) -> float:
        """Calcula gastos totales de un cliente"""
        query = db.query(func.sum(Pago.monto)).join(Cita).filter(
            Cita.cliente_id == cliente_id,
            Pago.estado == EstadoPago.COMPLETADO
        )
        
        if fecha_desde:
            query = query.filter(Pago.created_at >= fecha_desde)
        
        if fecha_hasta:
            query = query.filter(Pago.created_at <= fecha_hasta)
        
        resultado = query.scalar()
        return float(resultado) if resultado else 0.0
    
    @staticmethod
    def verificar_pago_duplicado(
        db: Session,
        cita_id: int,
        transaccion_id: str
    ) -> bool:
        """Verifica si existe un pago duplicado"""
        return db.query(Pago).filter(
            and_(
                Pago.cita_id == cita_id,
                Pago.transaccion_id == transaccion_id
            )
        ).first() is not None
    
    @staticmethod
    def contar_por_estado(
        db: Session,
        user_id: int,
        es_profesional: bool = False
    ) -> dict:
        """Cuenta pagos agrupados por estado"""
        if es_profesional:
            filtro = Cita.profesional_id == user_id
        else:
            filtro = Cita.cliente_id == user_id
        
        resultados = db.query(
            Pago.estado,
            func.count(Pago.id)
        ).join(Cita).filter(filtro).group_by(Pago.estado).all()
        
        return {estado.value: count for estado, count in resultados}
    
    @staticmethod
    def obtener_ultimos(
        db: Session,
        user_id: int,
        es_profesional: bool = False,
        limit: int = 10
    ) -> List[Pago]:
        """Obtiene últimos pagos de un usuario"""
        if es_profesional:
            filtro = Cita.profesional_id == user_id
        else:
            filtro = Cita.cliente_id == user_id
        
        return db.query(Pago).join(Cita).filter(
            filtro
        ).order_by(Pago.created_at.desc()).limit(limit).all()
