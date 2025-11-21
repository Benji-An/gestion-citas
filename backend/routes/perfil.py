from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import User
from schemas import PerfilUpdate, PasswordChange, User as UserSchema
from security import get_current_active_user, verify_password, get_password_hash

router = APIRouter(prefix="/api/perfil", tags=["perfil"])


@router.get("/me", response_model=UserSchema)
def obtener_perfil(
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Obtiene el perfil del usuario actual"""
    # Obtener el usuario completo de la base de datos
    user = db.query(User).filter(User.email == current_user.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user


@router.put("/actualizar")
def actualizar_perfil(
    perfil_data: PerfilUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Actualiza la información del perfil del usuario"""
    # Obtener el usuario completo de la base de datos
    user = db.query(User).filter(User.email == current_user.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Si se está cambiando el email, verificar que no exista
    if perfil_data.email and perfil_data.email != user.email:
        email_exists = db.query(User).filter(User.email == perfil_data.email).first()
        if email_exists:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Este email ya está registrado"
            )
        user.email = perfil_data.email
    
    # Actualizar campos
    if perfil_data.nombre is not None:
        user.nombre = perfil_data.nombre
    if perfil_data.apellido is not None:
        user.apellido = perfil_data.apellido
    if perfil_data.telefono is not None:
        user.telefono = perfil_data.telefono
    if perfil_data.fecha_nacimiento is not None:
        user.fecha_nacimiento = perfil_data.fecha_nacimiento
    if perfil_data.genero is not None:
        user.genero = perfil_data.genero
    if perfil_data.direccion is not None:
        user.direccion = perfil_data.direccion
    if perfil_data.ciudad is not None:
        user.ciudad = perfil_data.ciudad
    if perfil_data.pais is not None:
        user.pais = perfil_data.pais
    if perfil_data.codigo_postal is not None:
        user.codigo_postal = perfil_data.codigo_postal
    if perfil_data.foto_perfil is not None:
        user.foto_perfil = perfil_data.foto_perfil
    
    db.commit()
    db.refresh(user)
    
    return {
        "message": "Perfil actualizado exitosamente",
        "user": {
            "id": user.id,
            "email": user.email,
            "nombre": user.nombre,
            "apellido": user.apellido,
            "telefono": user.telefono,
            "fecha_nacimiento": user.fecha_nacimiento.isoformat() if user.fecha_nacimiento else None,
            "genero": user.genero,
            "direccion": user.direccion,
            "ciudad": user.ciudad,
            "pais": user.pais,
            "codigo_postal": user.codigo_postal,
            "foto_perfil": user.foto_perfil,
            "tipo_usuario": user.tipo_usuario
        }
    }


@router.put("/cambiar-password")
def cambiar_password(
    password_data: PasswordChange,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Cambia la contraseña del usuario"""
    # Obtener el usuario completo de la base de datos
    user = db.query(User).filter(User.email == current_user.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Verificar contraseña actual
    if not verify_password(password_data.password_actual, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Contraseña actual incorrecta"
        )
    
    # Validar nueva contraseña
    if len(password_data.password_nuevo) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La nueva contraseña debe tener al menos 6 caracteres"
        )
    
    # Actualizar contraseña
    user.hashed_password = get_password_hash(password_data.password_nuevo)
    db.commit()
    
    return {"message": "Contraseña cambiada exitosamente"}


@router.delete("/eliminar-cuenta")
def eliminar_cuenta(
    password: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Elimina la cuenta del usuario (desactivación)"""
    # Obtener el usuario completo de la base de datos
    user = db.query(User).filter(User.email == current_user.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Verificar contraseña
    if not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Contraseña incorrecta"
        )
    
    # Desactivar cuenta en lugar de eliminar
    user.is_active = False
    db.commit()
    
    return {"message": "Cuenta desactivada exitosamente"}
