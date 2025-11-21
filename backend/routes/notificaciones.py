from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from typing import List
from fastapi.responses import JSONResponse

from database import get_db
from models import Notificacion, User
from schemas import NotificacionResponse, MarcarLeidaRequest
from security import get_current_active_user

router = APIRouter(prefix="/api/notificaciones", tags=["notificaciones"])


@router.get("/mis-notificaciones")
def obtener_mis_notificaciones(
    leidas: bool = None,
    limite: int = 50,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """
    Obtiene las notificaciones del usuario
    Puede filtrar por leídas/no leídas
    """
    # Obtener el usuario completo de la base de datos
    user = db.query(User).filter(User.email == current_user.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    query = db.query(Notificacion).filter(Notificacion.usuario_id == user.id)
    
    if leidas is not None:
        query = query.filter(Notificacion.leida == leidas)
    
    notificaciones = query.order_by(Notificacion.created_at.desc()).limit(limite).all()
    
    # Convertir a diccionario para serializar correctamente el enum
    return [
        {
            "id": n.id,
            "titulo": n.titulo,
            "mensaje": n.mensaje,
            "tipo": n.tipo.value if hasattr(n.tipo, 'value') else str(n.tipo),
            "leida": n.leida,
            "cita_id": n.cita_id,
            "created_at": n.created_at
        }
        for n in notificaciones
    ]


@router.get("/no-leidas/count")
def contar_no_leidas(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Cuenta las notificaciones no leídas del usuario"""
    # Obtener el usuario completo de la base de datos
    user = db.query(User).filter(User.email == current_user.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    count = db.query(Notificacion).filter(
        Notificacion.usuario_id == user.id,
        Notificacion.leida == False
    ).count()
    
    return {"count": count}


@router.put("/marcar-leida/{notificacion_id}")
def marcar_notificacion_leida(
    notificacion_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Marca una notificación como leída"""
    # Obtener el usuario completo de la base de datos
    user = db.query(User).filter(User.email == current_user.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    notificacion = db.query(Notificacion).filter(
        Notificacion.id == notificacion_id,
        Notificacion.usuario_id == user.id
    ).first()
    
    if not notificacion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notificación no encontrada"
        )
    
    notificacion.leida = True
    db.commit()
    
    return {"message": "Notificación marcada como leída"}


@router.put("/marcar-todas-leidas")
def marcar_todas_leidas(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Marca todas las notificaciones del usuario como leídas"""
    # Obtener el usuario completo de la base de datos
    user = db.query(User).filter(User.email == current_user.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    db.query(Notificacion).filter(
        Notificacion.usuario_id == user.id,
        Notificacion.leida == False
    ).update({"leida": True})
    
    db.commit()
    
    return {"message": "Todas las notificaciones marcadas como leídas"}


@router.delete("/eliminar/{notificacion_id}")
def eliminar_notificacion(
    notificacion_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Elimina una notificación"""
    # Obtener el usuario completo de la base de datos
    user = db.query(User).filter(User.email == current_user.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    notificacion = db.query(Notificacion).filter(
        Notificacion.id == notificacion_id,
        Notificacion.usuario_id == user.id
    ).first()
    
    if not notificacion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notificación no encontrada"
        )
    
    db.delete(notificacion)
    db.commit()
    
    return {"message": "Notificación eliminada"}
