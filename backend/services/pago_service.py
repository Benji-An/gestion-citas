"""
Servicios relacionados con pagos
Lógica de negocio para procesamiento de pagos
"""

from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
import uuid
import os

from models import Pago, Cita, User, PerfilProfesional, EstadoPago


class PagoService:
    """Servicio para operaciones de pagos"""
    
    @staticmethod
    def crear_pago_simulado(
        db: Session,
        cita_id: int,
        monto: float,
        metodo_pago: str = "paypal"
    ) -> dict:
        """
        Crea un pago simulado para desarrollo/pruebas
        """
        # Generar ID de pago simulado
        payment_id = f"PAYID-SIMULATED-{uuid.uuid4().hex[:20].upper()}"
        monto_usd = round(monto / 4000, 2)  # Conversión COP a USD
        
        # Crear registro de pago pendiente
        nuevo_pago = Pago(
            cita_id=cita_id,
            monto=monto,
            estado=EstadoPago.PENDIENTE,
            metodo_pago=metodo_pago,
            referencia_transaccion=payment_id
        )
        
        db.add(nuevo_pago)
        db.commit()
        db.refresh(nuevo_pago)
        
        # URL simulada - redirige directamente a éxito
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
        approval_url = f"{frontend_url}/pago-completado?paymentId={payment_id}&PayerID=SIMULATED-PAYER-ID&cita_id={cita_id}"
        
        return {
            "pago_id": nuevo_pago.id,
            "paypal_payment_id": payment_id,
            "approval_url": approval_url,
            "monto_usd": monto_usd,
            "monto_cop": monto,
            "simulado": True
        }
    
    @staticmethod
    def ejecutar_pago_simulado(
        db: Session,
        pago: Pago
    ) -> dict:
        """
        Ejecuta/completa un pago simulado
        """
        # Actualizar estado a completado
        pago.estado = EstadoPago.COMPLETADO
        db.commit()
        db.refresh(pago)
        
        return {
            "success": True,
            "state": "approved",
            "pago_id": pago.id
        }
    
    @staticmethod
    def obtener_estadisticas_pagos(db: Session, cliente_id: int) -> dict:
        """
        Obtiene estadísticas de pagos del cliente
        """
        pagos = db.query(Pago).join(Cita).filter(
            Cita.cliente_id == cliente_id
        ).all()
        
        total_gastado = sum(p.monto for p in pagos if p.estado == EstadoPago.COMPLETADO)
        total_pagos = len(pagos)
        pagos_pendientes = len([p for p in pagos if p.estado == EstadoPago.PENDIENTE])
        pagos_completados = len([p for p in pagos if p.estado == EstadoPago.COMPLETADO])
        
        return {
            "total_gastado": float(total_gastado) if total_gastado else 0.0,
            "total_pagos": total_pagos,
            "pagos_pendientes": pagos_pendientes,
            "pagos_completados": pagos_completados
        }
    
    @staticmethod
    def verificar_pago_duplicado(db: Session, cita_id: int) -> bool:
        """
        Verifica si ya existe un pago completado para una cita
        """
        pago_existente = db.query(Pago).filter(
            Pago.cita_id == cita_id,
            Pago.estado == EstadoPago.COMPLETADO
        ).first()
        
        return pago_existente is not None
