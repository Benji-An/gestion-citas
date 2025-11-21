from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
import os

from database import get_db
from models import Pago, Cita, User, PerfilProfesional, EstadoPago
from schemas import PagoResponse, PagoCreate, PayPalPagoRequest
from security import get_current_active_user
from utils.notificaciones import notificar_pago_exitoso, notificar_pago_fallido
from utils.paypal_config import crear_pago_paypal, ejecutar_pago_paypal, obtener_pago_paypal

router = APIRouter(prefix="/api/pagos", tags=["pagos"])


@router.get("/mis-pagos", response_model=List[PagoResponse])
def obtener_mis_pagos(
    estado: str = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """
    Obtiene el historial de pagos del cliente
    Puede filtrar por estado: pendiente, completado, fallido, reembolsado
    """
    # Obtener el usuario completo de la base de datos
    user = db.query(User).filter(User.email == current_user.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Obtener pagos de las citas del cliente
    query = db.query(Pago).join(Cita).filter(Cita.cliente_id == user.id)
    
    if estado:
        try:
            estado_enum = EstadoPago[estado]
            query = query.filter(Pago.estado == estado_enum)
        except KeyError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Estado inválido. Opciones: {[e.name for e in EstadoPago]}"
            )
    
    pagos = query.order_by(Pago.created_at.desc()).all()
    
    # Enriquecer con información de la cita y profesional
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


@router.get("/pago/{pago_id}", response_model=PagoResponse)
def obtener_pago(
    pago_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Obtiene los detalles de un pago específico"""
    # Obtener el usuario completo de la base de datos
    user = db.query(User).filter(User.email == current_user.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    pago = db.query(Pago).join(Cita).filter(
        Pago.id == pago_id,
        Cita.cliente_id == user.id
    ).first()
    
    if not pago:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pago no encontrado"
        )
    
    cita = db.query(Cita).filter(Cita.id == pago.cita_id).first()
    profesional = db.query(User).filter(User.id == cita.profesional_id).first()
    perfil = db.query(PerfilProfesional).filter(
        PerfilProfesional.usuario_id == cita.profesional_id
    ).first()
    
    return {
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
            "duracion_minutos": cita.duracion_minutos
        },
        "profesional": {
            "nombre_completo": f"{profesional.nombre} {profesional.apellido}",
            "especialidad": perfil.especialidad if perfil else None,
            "telefono": profesional.telefono
        }
    }


@router.post("/procesar-pago", response_model=PagoResponse)
def procesar_pago(
    pago_data: PagoCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Procesa un pago para una cita"""
    # Obtener el usuario completo de la base de datos
    user = db.query(User).filter(User.email == current_user.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Verificar que la cita existe y pertenece al cliente
    cita = db.query(Cita).filter(
        Cita.id == pago_data.cita_id,
        Cita.cliente_id == user.id
    ).first()
    
    if not cita:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cita no encontrada"
        )
    
    # Verificar que no exista un pago completado para esta cita
    pago_existente = db.query(Pago).filter(
        Pago.cita_id == pago_data.cita_id,
        Pago.estado == EstadoPago.COMPLETADO
    ).first()
    
    if pago_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Esta cita ya tiene un pago completado"
        )
    
    # Crear el pago (aquí se integraría con pasarela de pago real)
    nuevo_pago = Pago(
        cita_id=pago_data.cita_id,
        monto=pago_data.monto,
        estado=EstadoPago.COMPLETADO,  # En producción: pendiente → completado
        metodo_pago=pago_data.metodo_pago,
        referencia_transaccion=f"REF-{pago_data.cita_id}-{user.id}"
    )
    
    db.add(nuevo_pago)
    db.commit()
    db.refresh(nuevo_pago)
    
    # Crear notificación de pago exitoso
    notificar_pago_exitoso(db, cita, user, pago_data.monto, nuevo_pago.referencia_transaccion)
    
    profesional = db.query(User).filter(User.id == cita.profesional_id).first()
    perfil = db.query(PerfilProfesional).filter(
        PerfilProfesional.usuario_id == cita.profesional_id
    ).first()
    
    return {
        "id": nuevo_pago.id,
        "cita_id": nuevo_pago.cita_id,
        "monto": nuevo_pago.monto,
        "estado": nuevo_pago.estado.name,
        "metodo_pago": nuevo_pago.metodo_pago,
        "referencia_transaccion": nuevo_pago.referencia_transaccion,
        "fecha_pago": nuevo_pago.created_at,
        "cita": {
            "fecha_hora": cita.fecha_hora,
            "motivo": cita.motivo,
            "estado": cita.estado.name
        },
        "profesional": {
            "nombre_completo": f"{profesional.nombre} {profesional.apellido}",
            "especialidad": perfil.especialidad if perfil else None
        }
    }


@router.get("/estadisticas")
def obtener_estadisticas_pagos(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Obtiene estadísticas de pagos del cliente"""
    # Obtener el usuario completo de la base de datos
    user = db.query(User).filter(User.email == current_user.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    pagos = db.query(Pago).join(Cita).filter(
        Cita.cliente_id == user.id
    ).all()
    
    total_gastado = sum(p.monto for p in pagos if p.estado == EstadoPago.COMPLETADO)
    total_pagos = len(pagos)
    pagos_pendientes = len([p for p in pagos if p.estado == EstadoPago.PENDIENTE])
    pagos_completados = len([p for p in pagos if p.estado == EstadoPago.COMPLETADO])
    
    return {
        "total_gastado": total_gastado,
        "total_pagos": total_pagos,
        "pagos_pendientes": pagos_pendientes,
        "pagos_completados": pagos_completados
    }


# ==================== ENDPOINTS DE PAYPAL ====================

@router.post("/paypal/crear-pago")
def crear_pago_con_paypal(
    request: PayPalPagoRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """
    Crea un pago con PayPal para una cita (MODO SIMULACIÓN)
    Retorna la URL de aprobación para redirigir al usuario
    """
    # Obtener el usuario completo de la base de datos
    user = db.query(User).filter(User.email == current_user.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Verificar que la cita existe y pertenece al cliente
    cita = db.query(Cita).filter(
        Cita.id == request.cita_id,
        Cita.cliente_id == user.id
    ).first()
    
    if not cita:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cita no encontrada"
        )
    
    # Verificar que no exista un pago completado
    pago_existente = db.query(Pago).filter(
        Pago.cita_id == request.cita_id,
        Pago.estado == EstadoPago.COMPLETADO
    ).first()
    
    if pago_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Esta cita ya tiene un pago completado"
        )
    
    # ==================== MODO SIMULACIÓN ====================
    # Simular creación de pago en PayPal sin hacer llamadas reales
    import uuid
    from datetime import datetime
    
    payment_id = f"PAYID-SIMULATED-{uuid.uuid4().hex[:20].upper()}"
    monto_usd = round(cita.precio / 4000, 2)  # Conversión COP a USD simulada
    
    profesional = db.query(User).filter(User.id == cita.profesional_id).first()
    
    # Crear registro de pago pendiente
    nuevo_pago = Pago(
        cita_id=request.cita_id,
        monto=cita.precio,
        estado=EstadoPago.PENDIENTE,
        metodo_pago="paypal",
        referencia_transaccion=payment_id
    )
    
    db.add(nuevo_pago)
    db.commit()
    db.refresh(nuevo_pago)
    
    # URL simulada de PayPal - redirige directamente a la página de éxito
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    approval_url = f"{frontend_url}/pago-completado?paymentId={payment_id}&PayerID=SIMULATED-PAYER-ID&cita_id={request.cita_id}"
    
    return {
        "pago_id": nuevo_pago.id,
        "paypal_payment_id": payment_id,
        "approval_url": approval_url,
        "monto_usd": monto_usd,
        "monto_cop": cita.precio,
        "simulado": True
    }


@router.post("/paypal/ejecutar-pago")
def ejecutar_pago_con_paypal(
    payment_id: str = Query(..., description="ID del pago de PayPal"),
    payer_id: str = Query(..., description="ID del pagador"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """
    Ejecuta un pago de PayPal después de que el usuario lo apruebe
    Este endpoint se llama cuando el usuario regresa de PayPal
    """
    # Obtener el usuario completo de la base de datos
    user = db.query(User).filter(User.email == current_user.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Buscar el pago en la base de datos
    pago = db.query(Pago).filter(
        Pago.referencia_transaccion == payment_id,
        Pago.estado == EstadoPago.PENDIENTE
    ).first()
    
    if not pago:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pago no encontrado o ya procesado"
        )
    
    # Verificar que la cita pertenece al usuario
    cita = db.query(Cita).filter(
        Cita.id == pago.cita_id,
        Cita.cliente_id == user.id
    ).first()
    
    if not cita:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para este pago"
        )
    
    # ==================== MODO SIMULACIÓN ====================
    # Simular ejecución exitosa del pago sin llamar a PayPal real
    
    # Actualizar estado del pago a completado
    pago.estado = EstadoPago.COMPLETADO
    db.commit()
    db.refresh(pago)
    
    # Crear notificación de pago exitoso
    notificar_pago_exitoso(db, cita, user, pago.monto, payment_id)
    
    profesional = db.query(User).filter(User.id == cita.profesional_id).first()
    perfil = db.query(PerfilProfesional).filter(
        PerfilProfesional.usuario_id == cita.profesional_id
    ).first()
    
    return {
        "id": pago.id,
        "cita_id": pago.cita_id,
        "monto": pago.monto,
        "estado": pago.estado.name,
        "metodo_pago": pago.metodo_pago,
        "referencia_transaccion": pago.referencia_transaccion,
        "fecha_pago": pago.created_at,
        "paypal_state": "approved",
        "simulado": True,
        "cita": {
            "fecha_hora": cita.fecha_hora,
            "motivo": cita.motivo
        },
        "profesional": {
            "nombre_completo": f"{profesional.nombre} {profesional.apellido}",
            "especialidad": perfil.especialidad if perfil else None
        }
    }


@router.get("/paypal/estado/{payment_id}")
def obtener_estado_pago_paypal(
    payment_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """
    Obtiene el estado de un pago de PayPal
    """
    # Obtener el usuario completo de la base de datos
    user = db.query(User).filter(User.email == current_user.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Buscar el pago en la base de datos
    pago = db.query(Pago).filter(
        Pago.referencia_transaccion == payment_id
    ).first()
    
    if not pago:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pago no encontrado"
        )
    
    # Verificar que la cita pertenece al usuario
    cita = db.query(Cita).filter(
        Cita.id == pago.cita_id,
        Cita.cliente_id == user.id
    ).first()
    
    if not cita:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para ver este pago"
        )
    
    # ==================== MODO SIMULACIÓN ====================
    # Retornar estado simulado basado en el estado local
    from datetime import datetime
    
    paypal_state_map = {
        "PENDIENTE": "created",
        "COMPLETADO": "approved",
        "FALLIDO": "failed"
    }
    
    return {
        "pago_id": pago.id,
        "estado_local": pago.estado.name,
        "paypal_payment_id": payment_id,
        "paypal_state": paypal_state_map.get(pago.estado.name, "created"),
        "create_time": pago.created_at.isoformat() if hasattr(pago, 'created_at') else datetime.now().isoformat(),
        "monto": pago.monto,
        "simulado": True
    }
