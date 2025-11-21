"""
Servicios relacionados con clientes
Lógica de negocio para operaciones de clientes
"""

from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime, timezone, timedelta

from models import User, Cita, Pago, PerfilProfesional, EstadoCita, EstadoPago
from schemas import CitaResponse, PagoResponse


class ClienteService:
    """Servicio para operaciones de clientes"""
    
    @staticmethod
    def obtener_citas_cliente(
        db: Session,
        cliente_id: int,
        estado: Optional[str] = None,
        fecha_desde: Optional[datetime] = None,
        fecha_hasta: Optional[datetime] = None
    ) -> List[Cita]:
        """
        Obtiene las citas de un cliente con filtros opcionales
        """
        query = db.query(Cita).filter(Cita.cliente_id == cliente_id)
        
        if estado:
            try:
                estado_enum = EstadoCita[estado.upper()]
                query = query.filter(Cita.estado == estado_enum)
            except KeyError:
                pass  # Si el estado no es válido, ignorar filtro
        
        if fecha_desde:
            query = query.filter(Cita.fecha_hora >= fecha_desde)
        
        if fecha_hasta:
            query = query.filter(Cita.fecha_hora <= fecha_hasta)
        
        return query.order_by(Cita.fecha_hora.desc()).all()
    
    @staticmethod
    def obtener_proximas_citas(db: Session, cliente_id: int, limit: int = 5) -> List[Cita]:
        """
        Obtiene las próximas citas del cliente
        """
        fecha_actual = datetime.now(timezone.utc)
        return db.query(Cita).filter(
            Cita.cliente_id == cliente_id,
            Cita.fecha_hora >= fecha_actual,
            Cita.estado.in_([EstadoCita.PENDIENTE, EstadoCita.CONFIRMADA])
        ).order_by(Cita.fecha_hora.asc()).limit(limit).all()
    
    @staticmethod
    def obtener_historial_citas(db: Session, cliente_id: int, limit: int = 10) -> List[Cita]:
        """
        Obtiene el historial de citas pasadas del cliente
        """
        fecha_actual = datetime.now(timezone.utc)
        return db.query(Cita).filter(
            Cita.cliente_id == cliente_id,
            Cita.fecha_hora < fecha_actual
        ).order_by(Cita.fecha_hora.desc()).limit(limit).all()
    
    @staticmethod
    def obtener_pagos_cliente(
        db: Session,
        cliente_id: int,
        estado: Optional[str] = None
    ) -> List[dict]:
        """
        Obtiene los pagos de un cliente con información enriquecida
        """
        query = db.query(Pago).join(Cita).filter(Cita.cliente_id == cliente_id)
        
        if estado:
            try:
                estado_enum = EstadoPago[estado.upper()]
                query = query.filter(Pago.estado == estado_enum)
            except KeyError:
                pass
        
        pagos = query.order_by(Pago.created_at.desc()).all()
        
        # Enriquecer con información de cita y profesional
        pagos_response = []
        for pago in pagos:
            cita = db.query(Cita).filter(Cita.id == pago.cita_id).first()
            if not cita:
                continue
            
            profesional = db.query(User).filter(User.id == cita.profesional_id).first()
            if not profesional:
                continue
            
            perfil = db.query(PerfilProfesional).filter(
                PerfilProfesional.usuario_id == cita.profesional_id
            ).first()
            
            pago_dict = {
                "id": pago.id,
                "cita_id": pago.cita_id,
                "monto": pago.monto,
                "estado": pago.estado.name,
                "metodo_pago": pago.metodo_pago,
                "referencia_transaccion": pago.referencia_transaccion,
                "fecha_pago": pago.created_at,
                "cita": {
                    "fecha_hora": cita.fecha_hora,
                    "motivo": cita.motivo,
                    "estado": cita.estado.name,
                    "duracion_minutos": cita.duracion_minutos if hasattr(cita, 'duracion_minutos') else 60
                },
                "profesional": {
                    "nombre_completo": f"{profesional.nombre} {profesional.apellido}",
                    "especialidad": perfil.especialidad if perfil else None,
                    "telefono": profesional.telefono if hasattr(profesional, 'telefono') else None
                }
            }
            pagos_response.append(pago_dict)
        
        return pagos_response
    
    @staticmethod
    def obtener_estadisticas_cliente(db: Session, cliente_id: int) -> dict:
        """
        Obtiene estadísticas del cliente
        """
        # Total de citas
        total_citas = db.query(func.count(Cita.id)).filter(
            Cita.cliente_id == cliente_id
        ).scalar()
        
        # Citas completadas
        citas_completadas = db.query(func.count(Cita.id)).filter(
            Cita.cliente_id == cliente_id,
            Cita.estado == EstadoCita.COMPLETADA
        ).scalar()
        
        # Citas pendientes
        citas_pendientes = db.query(func.count(Cita.id)).filter(
            Cita.cliente_id == cliente_id,
            Cita.estado.in_([EstadoCita.PENDIENTE, EstadoCita.CONFIRMADA])
        ).scalar()
        
        # Total gastado
        pagos = db.query(Pago).join(Cita).filter(
            Cita.cliente_id == cliente_id,
            Pago.estado == EstadoPago.COMPLETADO
        ).all()
        
        total_gastado = sum(p.monto for p in pagos)
        
        # Profesionales únicos visitados
        profesionales_unicos = db.query(func.count(func.distinct(Cita.profesional_id))).filter(
            Cita.cliente_id == cliente_id
        ).scalar()
        
        return {
            "total_citas": total_citas or 0,
            "citas_completadas": citas_completadas or 0,
            "citas_pendientes": citas_pendientes or 0,
            "total_gastado": float(total_gastado) if total_gastado else 0.0,
            "profesionales_visitados": profesionales_unicos or 0
        }
    
    @staticmethod
    def verificar_puede_agendar(db: Session, cliente_id: int) -> tuple[bool, str]:
        """
        Verifica si el cliente puede agendar una nueva cita
        Retorna (puede_agendar, mensaje)
        """
        # Verificar si tiene citas pendientes sin pagar
        citas_sin_pagar = db.query(Cita).outerjoin(Pago).filter(
            Cita.cliente_id == cliente_id,
            Cita.estado.in_([EstadoCita.PENDIENTE, EstadoCita.CONFIRMADA]),
            Pago.id == None
        ).count()
        
        if citas_sin_pagar > 3:
            return False, "Tienes demasiadas citas pendientes sin pagar"
        
        return True, "Puede agendar"
