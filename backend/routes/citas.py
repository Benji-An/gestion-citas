from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta, timezone

from database import get_db
from models import Cita, User, PerfilProfesional, EstadoCita
from schemas import CitaCreate, CitaResponse, CitaUpdate
from security import get_current_active_user
from utils.notificaciones import (
    notificar_cita_creada,
    notificar_cita_cancelada,
    notificar_cita_reagendada
)

router = APIRouter(prefix="/api/citas", tags=["citas"])


@router.get("/admin/todas", status_code=status.HTTP_200_OK)
def obtener_todas_citas_admin(
    estado: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """
    Endpoint para admin: obtiene TODAS las citas del sistema
    Requiere que el usuario actual sea admin
    """
    # Obtener el usuario completo de la base de datos
    user = db.query(User).filter(User.email == current_user.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Verificar que sea admin
    if user.tipo_usuario != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los administradores pueden acceder a todas las citas"
        )
    
    query = db.query(Cita)
    
    # Filtrar por estado si se proporciona
    if estado and estado != "todas":
        try:
            estado_enum = EstadoCita[estado.upper()]
            query = query.filter(Cita.estado == estado_enum)
        except KeyError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Estado inválido. Opciones: {[e.name.lower() for e in EstadoCita]}"
            )
    
    citas = query.order_by(Cita.fecha_hora.desc()).all()
    
    # Enriquecer con información del cliente y profesional
    citas_response = []
    for cita in citas:
        cliente = db.query(User).filter(User.id == cita.cliente_id).first()
        profesional = db.query(User).filter(User.id == cita.profesional_id).first()
        perfil_prof = db.query(PerfilProfesional).filter(
            PerfilProfesional.usuario_id == cita.profesional_id
        ).first()
        
        cita_dict = {
            "id": cita.id,
            "fecha_hora": cita.fecha_hora.isoformat() if cita.fecha_hora else None,
            "duracion_minutos": cita.duracion_minutos,
            "estado": cita.estado.name.lower(),
            "motivo": cita.motivo,
            "notas": cita.notas,
            "precio": float(cita.precio) if cita.precio else 0,
            "created_at": cita.created_at.isoformat() if hasattr(cita, 'created_at') and cita.created_at else None,
            "cliente": {
                "id": cliente.id,
                "nombre_completo": f"{cliente.nombre} {cliente.apellido}",
                "email": cliente.email,
                "telefono": cliente.telefono
            } if cliente else None,
            "profesional": {
                "id": profesional.id,
                "nombre_completo": f"{profesional.nombre} {profesional.apellido}",
                "email": profesional.email,
                "especialidad": perfil_prof.especialidad if perfil_prof else "No especificada",
                "telefono": profesional.telefono
            } if profesional else None
        }
        citas_response.append(cita_dict)
    
    return {
        "citas": citas_response,
        "total": len(citas_response)
    }


@router.get("/mis-citas", response_model=List[CitaResponse])
def obtener_mis_citas(
    estado: str = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """
    Obtiene las citas del cliente actual
    Puede filtrar por estado: pendiente, confirmada, cancelada, completada
    """
    # Obtener el usuario completo de la base de datos
    user = db.query(User).filter(User.email == current_user.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    query = db.query(Cita).filter(Cita.cliente_id == user.id)
    
    if estado:
        try:
            estado_enum = EstadoCita[estado]
            query = query.filter(Cita.estado == estado_enum)
        except KeyError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Estado inválido. Opciones: {[e.name for e in EstadoCita]}"
            )
    
    citas = query.order_by(Cita.fecha_hora.desc()).all()
    
    # Enriquecer con información del profesional
    citas_response = []
    for cita in citas:
        profesional = db.query(User).filter(User.id == cita.profesional_id).first()
        perfil = db.query(PerfilProfesional).filter(
            PerfilProfesional.usuario_id == cita.profesional_id
        ).first()
        
        cita_dict = {
            "id": cita.id,
            "fecha_hora": cita.fecha_hora,
            "duracion_minutos": cita.duracion_minutos,
            "estado": cita.estado.name,
            "motivo": cita.motivo,
            "notas": cita.notas,
            "precio": cita.precio,
            "profesional": {
                "id": profesional.id,
                "nombre_completo": f"{profesional.nombre} {profesional.apellido}",
                "especialidad": perfil.especialidad if perfil else None,
                "foto_url": perfil.foto_url if perfil else None
            }
        }
        citas_response.append(cita_dict)
    
    return citas_response


@router.get("/cita/{cita_id}", response_model=CitaResponse)
def obtener_cita(
    cita_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Obtiene los detalles de una cita específica"""
    # Obtener el usuario completo de la base de datos
    user = db.query(User).filter(User.email == current_user.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    cita = db.query(Cita).filter(
        Cita.id == cita_id,
        Cita.cliente_id == user.id
    ).first()
    
    if not cita:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cita no encontrada"
        )
    
    profesional = db.query(User).filter(User.id == cita.profesional_id).first()
    perfil = db.query(PerfilProfesional).filter(
        PerfilProfesional.usuario_id == cita.profesional_id
    ).first()
    
    return {
        "id": cita.id,
        "fecha_hora": cita.fecha_hora,
        "duracion_minutos": cita.duracion_minutos,
        "estado": cita.estado.name,
        "motivo": cita.motivo,
        "notas": cita.notas,
        "precio": cita.precio,
        "profesional": {
            "id": profesional.id,
            "nombre_completo": f"{profesional.nombre} {profesional.apellido}",
            "especialidad": perfil.especialidad if perfil else None,
            "foto_url": perfil.foto_url if perfil else None,
            "telefono": profesional.telefono,
            "direccion": perfil.direccion if perfil else None
        }
    }


@router.post("/agendar", response_model=CitaResponse)
def agendar_cita(
    cita_data: CitaCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Agenda una nueva cita"""
    try:
        print(f"=== AGENDAR CITA ===")
        print(f"Usuario actual: {current_user.email}")
        print(f"Datos recibidos: {cita_data}")
        
        # Obtener el usuario completo de la base de datos
        user = db.query(User).filter(User.email == current_user.email).first()
        if not user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
        # Verificar que el profesional existe
        profesional = db.query(User).filter(
            User.id == cita_data.profesional_id,
            User.tipo_usuario == "profesional"
        ).first()
        
        if not profesional:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profesional no encontrado"
            )
        
        # Verificar que la fecha sea futura
        fecha_actual = datetime.now(timezone.utc)
        fecha_cita = cita_data.fecha_hora
        if fecha_cita.tzinfo is None:
            fecha_cita = fecha_cita.replace(tzinfo=timezone.utc)
        
        if fecha_cita <= fecha_actual:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La fecha debe ser futura"
            )
        
        # Verificar disponibilidad (evitar conflictos)
        # Obtener todas las citas del profesional en estados activos
        fecha_fin_nueva = fecha_cita + timedelta(minutes=cita_data.duracion_minutos)
        
        citas_existentes = db.query(Cita).filter(
            Cita.profesional_id == cita_data.profesional_id,
            Cita.estado.in_([EstadoCita.PENDIENTE, EstadoCita.CONFIRMADA])
        ).all()
        
        # Verificar conflictos en Python
        for cita_existente in citas_existentes:
            fecha_fin_existente = cita_existente.fecha_hora + timedelta(minutes=cita_existente.duracion_minutos)
            # Hay conflicto si las citas se solapan
            if (fecha_cita < fecha_fin_existente and fecha_fin_nueva > cita_existente.fecha_hora):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="El profesional ya tiene una cita en ese horario"
                )
        
        # Crear la cita con la fecha ajustada
        nueva_cita = Cita(
            cliente_id=user.id,
            profesional_id=cita_data.profesional_id,
            fecha_hora=fecha_cita,
            duracion_minutos=cita_data.duracion_minutos,
            estado=EstadoCita.PENDIENTE,
            motivo=cita_data.motivo,
            notas=cita_data.notas,
            precio=cita_data.precio
        )
        
        db.add(nueva_cita)
        db.commit()
        db.refresh(nueva_cita)
        
        # Crear notificaciones para cliente y profesional
        notificar_cita_creada(db, nueva_cita, user, profesional)
        
        perfil = db.query(PerfilProfesional).filter(
            PerfilProfesional.usuario_id == profesional.id
        ).first()
    
        return {
            "id": nueva_cita.id,
            "fecha_hora": nueva_cita.fecha_hora,
            "duracion_minutos": nueva_cita.duracion_minutos,
            "estado": nueva_cita.estado.name,
            "motivo": nueva_cita.motivo,
            "notas": nueva_cita.notas,
            "precio": nueva_cita.precio,
            "profesional": {
                "id": profesional.id,
                "nombre_completo": f"{profesional.nombre} {profesional.apellido}",
                "especialidad": perfil.especialidad if perfil else None,
                "foto_url": perfil.foto_url if perfil else None
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ ERROR en agendar_cita: {str(e)}")
        print(f"Tipo de error: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {str(e)}"
        )


@router.put("/cita/{cita_id}/cancelar")
def cancelar_cita(
    cita_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Cancela una cita"""
    # Obtener el usuario completo de la base de datos
    user = db.query(User).filter(User.email == current_user.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    cita = db.query(Cita).filter(
        Cita.id == cita_id,
        Cita.cliente_id == user.id
    ).first()
    
    if not cita:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cita no encontrada"
        )
    
    if cita.estado in [EstadoCita.CANCELADA, EstadoCita.COMPLETADA]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No se puede cancelar una cita en estado {cita.estado.name}"
        )
    
    # Obtener el profesional para las notificaciones
    profesional = db.query(User).filter(User.id == cita.profesional_id).first()
    
    cita.estado = EstadoCita.CANCELADA
    db.commit()
    
    # Crear notificaciones de cancelación
    notificar_cita_cancelada(db, cita, user, profesional, "cliente")
    
    return {"message": "Cita cancelada exitosamente"}


@router.put("/cita/{cita_id}/reagendar", response_model=CitaResponse)
def reagendar_cita(
    cita_id: int,
    nueva_fecha: datetime,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Reagenda una cita a una nueva fecha"""
    # Obtener el usuario completo de la base de datos
    user = db.query(User).filter(User.email == current_user.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    cita = db.query(Cita).filter(
        Cita.id == cita_id,
        Cita.cliente_id == user.id
    ).first()
    
    if not cita:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cita no encontrada"
        )
    
    # Verificar que la fecha sea futura
    fecha_actual = datetime.now(timezone.utc)
    fecha_reagendar = nueva_fecha
    if fecha_reagendar.tzinfo is None:
        fecha_reagendar = fecha_reagendar.replace(tzinfo=timezone.utc)
    
    if fecha_reagendar <= fecha_actual:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La nueva fecha debe ser futura"
        )
    
    # Verificar disponibilidad
    fecha_fin_nueva = nueva_fecha + timedelta(minutes=cita.duracion_minutos)
    
    citas_existentes = db.query(Cita).filter(
        Cita.profesional_id == cita.profesional_id,
        Cita.id != cita_id,  # Excluir la cita actual
        Cita.estado.in_([EstadoCita.PENDIENTE, EstadoCita.CONFIRMADA])
    ).all()
    
    # Verificar conflictos en Python
    for cita_existente in citas_existentes:
        fecha_fin_existente = cita_existente.fecha_hora + timedelta(minutes=cita_existente.duracion_minutos)
        if (nueva_fecha < fecha_fin_existente and fecha_fin_nueva > cita_existente.fecha_hora):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="El profesional ya tiene una cita en ese horario"
            )
    
    cita.fecha_hora = nueva_fecha
    db.commit()
    db.refresh(cita)
    
    profesional = db.query(User).filter(User.id == cita.profesional_id).first()
    
    # Crear notificaciones de reagendamiento
    notificar_cita_reagendada(db, cita, user, profesional, nueva_fecha)
    
    perfil = db.query(PerfilProfesional).filter(
        PerfilProfesional.usuario_id == cita.profesional_id
    ).first()
    
    return {
        "id": cita.id,
        "fecha_hora": cita.fecha_hora,
        "duracion_minutos": cita.duracion_minutos,
        "estado": cita.estado.name,
        "motivo": cita.motivo,
        "notas": cita.notas,
        "precio": cita.precio,
        "profesional": {
            "id": profesional.id,
            "nombre_completo": f"{profesional.nombre} {profesional.apellido}",
            "especialidad": perfil.especialidad if perfil else None,
            "foto_url": perfil.foto_url if perfil else None
        }
    }
