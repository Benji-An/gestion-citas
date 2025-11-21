from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta

from database import get_db
from models import User, PerfilProfesional, TipoUsuario, Favorito, Cita, EstadoCita, Disponibilidad, DiaSemana
from security import get_current_active_user
from schemas import TokenData
from services.profesional_service import (
    obtener_estadisticas_profesional,
    obtener_proximas_citas,
    obtener_citas_profesional,
    obtener_disponibilidad_profesional,
    crear_disponibilidad,
    actualizar_disponibilidad,
    eliminar_disponibilidad,
    actualizar_estado_cita
)

router = APIRouter(prefix="/api/profesionales", tags=["Profesionales"])


@router.get("/", status_code=status.HTTP_200_OK)
async def listar_profesionales(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    especialidad: Optional[str] = None,
    ciudad: Optional[str] = None,
    busqueda: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Lista todos los profesionales con sus perfiles
    
    - **skip**: Número de registros a saltar (para paginación)
    - **limit**: Número máximo de registros a devolver
    - **especialidad**: Filtrar por especialidad
    - **ciudad**: Filtrar por ciudad
    - **busqueda**: Buscar por nombre o apellido
    """
    # Query base
    query = db.query(User, PerfilProfesional).join(
        PerfilProfesional,
        User.id == PerfilProfesional.usuario_id
    ).filter(
        User.tipo_usuario == TipoUsuario.PROFESIONAL,
        User.is_active == True
    )
    
    # Aplicar filtros
    if especialidad:
        query = query.filter(PerfilProfesional.especialidad.ilike(f"%{especialidad}%"))
    
    if ciudad:
        query = query.filter(PerfilProfesional.ciudad.ilike(f"%{ciudad}%"))
    
    if busqueda:
        query = query.filter(
            (User.nombre.ilike(f"%{busqueda}%")) |
            (User.apellido.ilike(f"%{busqueda}%"))
        )
    
    # Ordenar por calificación
    query = query.order_by(PerfilProfesional.calificacion_promedio.desc())
    
    # Contar total antes de paginar
    total = query.count()
    
    # Aplicar paginación
    results = query.offset(skip).limit(limit).all()
    
    # Formatear respuesta
    profesionales = []
    for user, perfil in results:
        profesionales.append({
            "id": user.id,
            "email": user.email,
            "nombre": user.nombre,
            "apellido": user.apellido,
            "nombre_completo": f"{user.nombre} {user.apellido}",
            "telefono": user.telefono,
            "especialidad": perfil.especialidad,
            "descripcion": perfil.descripcion,
            "experiencia_anos": perfil.experiencia_anos,
            "precio_consulta": perfil.precio_consulta,
            "direccion": perfil.direccion,
            "ciudad": perfil.ciudad,
            "foto_url": perfil.foto_url,
            "calificacion_promedio": perfil.calificacion_promedio,
            "numero_resenas": perfil.numero_resenas,
            "perfil_id": perfil.id
        })
    
    return {
        "profesionales": profesionales,
        "total": total,
        "skip": skip,
        "limit": limit
    }


# ============= ENDPOINTS DE PERFIL (DEBEN ESTAR ANTES DE /{profesional_id}) =============

@router.get("/perfil", status_code=status.HTTP_200_OK)
async def obtener_perfil_profesional(
    current_user: TokenData = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Obtiene el perfil completo del profesional
    """
    user = db.query(User).filter(User.email == current_user.email).first()
    if user.tipo_usuario != TipoUsuario.PROFESIONAL:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los profesionales pueden acceder a este endpoint"
        )
    
    # Obtener perfil profesional
    perfil = db.query(PerfilProfesional).filter(
        PerfilProfesional.usuario_id == user.id
    ).first()
    
    if not perfil:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Perfil profesional no encontrado"
        )
    
    return {
        "usuario": {
            "id": user.id,
            "email": user.email,
            "nombre": user.nombre,
            "apellido": user.apellido,
            "telefono": user.telefono,
            "fecha_nacimiento": user.fecha_nacimiento.isoformat() if user.fecha_nacimiento else None,
            "direccion": user.direccion,
            "ciudad": user.ciudad,
            "pais": user.pais,
            "codigo_postal": user.codigo_postal,
            "foto_perfil": user.foto_perfil,
            "notificaciones": {
                "email_citas": user.notif_email_citas,
                "email_cancelaciones": user.notif_email_cancelaciones,
                "email_pagos": user.notif_email_pagos,
                "sms_recordatorios": user.notif_sms_recordatorios,
                "email_marketing": user.notif_email_marketing
            },
            "privacidad": {
                "perfil_publico": user.perfil_publico,
                "mostrar_telefono": user.mostrar_telefono,
                "mostrar_email": user.mostrar_email
            }
        },
        "perfil_profesional": {
            "id": perfil.id,
            "especialidad": perfil.especialidad,
            "descripcion": perfil.descripcion,
            "experiencia_anos": perfil.experiencia_anos,
            "precio_consulta": perfil.precio_consulta,
            "direccion": perfil.direccion,
            "ciudad": perfil.ciudad,
            "calificacion_promedio": perfil.calificacion_promedio,
            "numero_resenas": perfil.numero_resenas,
            "licencia": perfil.licencia,
            "educacion": perfil.educacion,
            "idiomas": perfil.idiomas
        }
    }


@router.put("/perfil", status_code=status.HTTP_200_OK)
async def actualizar_perfil_profesional(
    nombre: Optional[str] = None,
    apellido: Optional[str] = None,
    telefono: Optional[str] = None,
    fecha_nacimiento: Optional[str] = None,
    direccion: Optional[str] = None,
    ciudad: Optional[str] = None,
    pais: Optional[str] = None,
    codigo_postal: Optional[str] = None,
    foto_perfil: Optional[str] = None,
    especialidad: Optional[str] = None,
    descripcion: Optional[str] = None,
    experiencia_anos: Optional[int] = None,
    precio_consulta: Optional[int] = None,
    direccion_consultorio: Optional[str] = None,
    ciudad_consultorio: Optional[str] = None,
    licencia: Optional[str] = None,
    educacion: Optional[str] = None,
    idiomas: Optional[str] = None,
    notif_email_citas: Optional[bool] = None,
    notif_email_cancelaciones: Optional[bool] = None,
    notif_email_pagos: Optional[bool] = None,
    notif_sms_recordatorios: Optional[bool] = None,
    notif_email_marketing: Optional[bool] = None,
    perfil_publico: Optional[bool] = None,
    mostrar_telefono: Optional[bool] = None,
    mostrar_email: Optional[bool] = None,
    current_user: TokenData = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Actualiza el perfil del profesional
    """
    user = db.query(User).filter(User.email == current_user.email).first()
    if user.tipo_usuario != TipoUsuario.PROFESIONAL:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los profesionales pueden actualizar su perfil"
        )
    
    # Actualizar datos del usuario
    if nombre is not None:
        user.nombre = nombre
    if apellido is not None:
        user.apellido = apellido
    if telefono is not None:
        user.telefono = telefono
    if fecha_nacimiento is not None:
        try:
            user.fecha_nacimiento = datetime.strptime(fecha_nacimiento, "%Y-%m-%d")
        except ValueError:
            pass
    if direccion is not None:
        user.direccion = direccion
    if ciudad is not None:
        user.ciudad = ciudad
    if pais is not None:
        user.pais = pais
    if codigo_postal is not None:
        user.codigo_postal = codigo_postal
    if foto_perfil is not None:
        user.foto_perfil = foto_perfil
    
    # Actualizar configuración de notificaciones
    if notif_email_citas is not None:
        user.notif_email_citas = notif_email_citas
    if notif_email_cancelaciones is not None:
        user.notif_email_cancelaciones = notif_email_cancelaciones
    if notif_email_pagos is not None:
        user.notif_email_pagos = notif_email_pagos
    if notif_sms_recordatorios is not None:
        user.notif_sms_recordatorios = notif_sms_recordatorios
    if notif_email_marketing is not None:
        user.notif_email_marketing = notif_email_marketing
    
    # Actualizar configuración de privacidad
    if perfil_publico is not None:
        user.perfil_publico = perfil_publico
    if mostrar_telefono is not None:
        user.mostrar_telefono = mostrar_telefono
    if mostrar_email is not None:
        user.mostrar_email = mostrar_email
    
    # Actualizar perfil profesional
    perfil = db.query(PerfilProfesional).filter(
        PerfilProfesional.usuario_id == user.id
    ).first()
    
    if perfil:
        if especialidad is not None:
            perfil.especialidad = especialidad
        if descripcion is not None:
            perfil.descripcion = descripcion
        if experiencia_anos is not None:
            perfil.experiencia_anos = experiencia_anos
        if precio_consulta is not None:
            perfil.precio_consulta = precio_consulta
        if direccion_consultorio is not None:
            perfil.direccion = direccion_consultorio
        if ciudad_consultorio is not None:
            perfil.ciudad = ciudad_consultorio
        if licencia is not None:
            perfil.licencia = licencia
        if educacion is not None:
            perfil.educacion = educacion
        if idiomas is not None:
            perfil.idiomas = idiomas
    
    db.commit()
    db.refresh(user)
    if perfil:
        db.refresh(perfil)
    
    return {"message": "Perfil actualizado correctamente"}


# ============= ENDPOINTS DE DISPONIBILIDAD (DEBEN ESTAR ANTES DE /{profesional_id}) =============

@router.get("/disponibilidad", status_code=status.HTTP_200_OK)
async def obtener_disponibilidad(
    current_user: TokenData = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Obtiene la disponibilidad semanal del profesional
    """
    user = db.query(User).filter(User.email == current_user.email).first()
    if user.tipo_usuario != TipoUsuario.PROFESIONAL:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los profesionales pueden gestionar disponibilidad"
        )
    
    disponibilidad = obtener_disponibilidad_profesional(db, user.id)
    return {"disponibilidad": disponibilidad}


@router.post("/disponibilidad", status_code=status.HTTP_201_CREATED)
async def crear_bloque_disponibilidad(
    dia_semana: str,
    hora_inicio: str,
    hora_fin: str,
    current_user: TokenData = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Crea un nuevo bloque de disponibilidad
    """
    user = db.query(User).filter(User.email == current_user.email).first()
    if user.tipo_usuario != TipoUsuario.PROFESIONAL:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los profesionales pueden gestionar disponibilidad"
        )
    
    try:
        dia_enum = DiaSemana[dia_semana.upper()]
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Día de semana inválido: {dia_semana}"
        )
    
    disponibilidad = crear_disponibilidad(db, user.id, dia_enum, hora_inicio, hora_fin)
    
    return {
        "id": disponibilidad.id,
        "dia_semana": disponibilidad.dia_semana.value,
        "hora_inicio": disponibilidad.hora_inicio,
        "hora_fin": disponibilidad.hora_fin
    }


@router.put("/disponibilidad/{disponibilidad_id}", status_code=status.HTTP_200_OK)
async def actualizar_bloque_disponibilidad(
    disponibilidad_id: int,
    hora_inicio: Optional[str] = None,
    hora_fin: Optional[str] = None,
    current_user: TokenData = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Actualiza un bloque de disponibilidad existente
    """
    user = db.query(User).filter(User.email == current_user.email).first()
    if user.tipo_usuario != TipoUsuario.PROFESIONAL:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los profesionales pueden gestionar disponibilidad"
        )
    
    disponibilidad = actualizar_disponibilidad(db, user.id, disponibilidad_id, hora_inicio, hora_fin)
    
    if not disponibilidad:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bloque de disponibilidad no encontrado"
        )
    
    return {
        "id": disponibilidad.id,
        "dia_semana": disponibilidad.dia_semana.value,
        "hora_inicio": disponibilidad.hora_inicio,
        "hora_fin": disponibilidad.hora_fin
    }


@router.delete("/disponibilidad/{disponibilidad_id}", status_code=status.HTTP_200_OK)
async def eliminar_bloque_disponibilidad(
    disponibilidad_id: int,
    current_user: TokenData = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Elimina un bloque de disponibilidad
    """
    user = db.query(User).filter(User.email == current_user.email).first()
    if user.tipo_usuario != TipoUsuario.PROFESIONAL:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los profesionales pueden gestionar disponibilidad"
        )
    
    success = eliminar_disponibilidad(db, user.id, disponibilidad_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bloque de disponibilidad no encontrado"
        )
    
    return {"message": "Bloque eliminado exitosamente"}


@router.get("/{profesional_id}", status_code=status.HTTP_200_OK)
async def obtener_profesional(
    profesional_id: int,
    db: Session = Depends(get_db)
):
    """
    Obtiene los detalles de un profesional específico
    """
    user = db.query(User).filter(
        User.id == profesional_id,
        User.tipo_usuario == TipoUsuario.PROFESIONAL
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profesional no encontrado"
        )
    
    perfil = db.query(PerfilProfesional).filter(
        PerfilProfesional.usuario_id == profesional_id
    ).first()
    
    if not perfil:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Perfil del profesional no encontrado"
        )
    
    return {
        "id": user.id,
        "email": user.email,
        "nombre": user.nombre,
        "apellido": user.apellido,
        "nombre_completo": f"{user.nombre} {user.apellido}",
        "telefono": user.telefono,
        "especialidad": perfil.especialidad,
        "descripcion": perfil.descripcion,
        "experiencia_anos": perfil.experiencia_anos,
        "precio_consulta": perfil.precio_consulta,
        "direccion": perfil.direccion,
        "ciudad": perfil.ciudad,
        "foto_url": perfil.foto_url,
        "calificacion_promedio": perfil.calificacion_promedio,
        "numero_resenas": perfil.numero_resenas,
        "perfil_id": perfil.id
    }


@router.get("/especialidades/listar", status_code=status.HTTP_200_OK)
async def listar_especialidades(db: Session = Depends(get_db)):
    """
    Lista todas las especialidades disponibles
    """
    especialidades = db.query(PerfilProfesional.especialidad).distinct().all()
    
    return {
        "especialidades": [esp[0] for esp in especialidades if esp[0]]
    }


@router.get("/ciudades/listar", status_code=status.HTTP_200_OK)
async def listar_ciudades(db: Session = Depends(get_db)):
    """
    Lista todas las ciudades disponibles
    """
    ciudades = db.query(PerfilProfesional.ciudad).distinct().all()
    
    return {
        "ciudades": [ciudad[0] for ciudad in ciudades if ciudad[0]]
    }


@router.post("/favoritos/{profesional_id}", status_code=status.HTTP_201_CREATED)
async def agregar_favorito(
    profesional_id: int,
    current_user: TokenData = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Agrega un profesional a favoritos del cliente actual
    """
    # Verificar que el usuario actual sea cliente
    user = db.query(User).filter(User.email == current_user.email).first()
    
    if user.tipo_usuario != TipoUsuario.CLIENTE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los clientes pueden agregar favoritos"
        )
    
    # Verificar que el profesional exista
    perfil = db.query(PerfilProfesional).filter(
        PerfilProfesional.usuario_id == profesional_id
    ).first()
    
    if not perfil:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profesional no encontrado"
        )
    
    # Verificar si ya existe el favorito
    favorito_existente = db.query(Favorito).filter(
        Favorito.cliente_id == user.id,
        Favorito.profesional_id == perfil.id
    ).first()
    
    if favorito_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Este profesional ya está en tus favoritos"
        )
    
    # Crear favorito
    nuevo_favorito = Favorito(
        cliente_id=user.id,
        profesional_id=perfil.id
    )
    
    db.add(nuevo_favorito)
    db.commit()
    
    return {"message": "Profesional agregado a favoritos"}


@router.delete("/favoritos/{profesional_id}", status_code=status.HTTP_200_OK)
async def eliminar_favorito(
    profesional_id: int,
    current_user: TokenData = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Elimina un profesional de favoritos del cliente actual
    """
    # Obtener usuario
    user = db.query(User).filter(User.email == current_user.email).first()
    
    # Obtener perfil profesional
    perfil = db.query(PerfilProfesional).filter(
        PerfilProfesional.usuario_id == profesional_id
    ).first()
    
    if not perfil:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profesional no encontrado"
        )
    
    # Buscar y eliminar favorito
    favorito = db.query(Favorito).filter(
        Favorito.cliente_id == user.id,
        Favorito.profesional_id == perfil.id
    ).first()
    
    if not favorito:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Este profesional no está en tus favoritos"
        )
    
    db.delete(favorito)
    db.commit()
    
    return {"message": "Profesional eliminado de favoritos"}


@router.get("/favoritos/mis-favoritos", status_code=status.HTTP_200_OK)
async def obtener_mis_favoritos(
    current_user: TokenData = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Obtiene la lista de profesionales favoritos del cliente actual
    """
    # Obtener usuario
    user = db.query(User).filter(User.email == current_user.email).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Obtener favoritos - corregir el query
    favoritos = db.query(
        Favorito, PerfilProfesional, User
    ).join(
        PerfilProfesional,
        Favorito.profesional_id == PerfilProfesional.id
    ).join(
        User,
        PerfilProfesional.usuario_id == User.id
    ).filter(
        Favorito.cliente_id == user.id
    ).all()
    
    profesionales = []
    for favorito, perfil, user_prof in favoritos:
        profesionales.append({
            "id": user_prof.id,
            "nombre_completo": f"{user_prof.nombre} {user_prof.apellido}",
            "especialidad": perfil.especialidad,
            "descripcion": perfil.descripcion,
            "precio_consulta": perfil.precio_consulta,
            "ciudad": perfil.ciudad,
            "calificacion_promedio": perfil.calificacion_promedio,
            "numero_resenas": perfil.numero_resenas,
            "foto_url": perfil.foto_url
        })
    
    return {"favoritos": profesionales}


# ===== ENDPOINTS DASHBOARD PROFESIONAL =====

@router.get("/dashboard/estadisticas", status_code=status.HTTP_200_OK)
async def obtener_estadisticas_dashboard(
    current_user: TokenData = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Obtiene estadísticas del dashboard del profesional actual
    """
    user = db.query(User).filter(User.email == current_user.email).first()
    
    if user.tipo_usuario != TipoUsuario.PROFESIONAL:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los profesionales pueden acceder a estas estadísticas"
        )
    
    estadisticas = obtener_estadisticas_profesional(db, user.id)
    return estadisticas


@router.get("/dashboard/proximas-citas", status_code=status.HTTP_200_OK)
async def obtener_proximas_citas_dashboard(
    limit: int = Query(5, ge=1, le=20),
    current_user: TokenData = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Obtiene las próximas citas del profesional
    """
    user = db.query(User).filter(User.email == current_user.email).first()
    
    if user.tipo_usuario != TipoUsuario.PROFESIONAL:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los profesionales pueden acceder a sus citas"
        )
    
    citas = obtener_proximas_citas(db, user.id, limit)
    
    # Formatear respuesta con información del cliente
    citas_formateadas = []
    for cita in citas:
        cliente = db.query(User).filter(User.id == cita.cliente_id).first()
        citas_formateadas.append({
            "id": cita.id,
            "fecha_hora": cita.fecha_hora.isoformat(),
            "duracion_minutos": cita.duracion_minutos,
            "estado": cita.estado.value,
            "motivo": cita.motivo,
            "notas": cita.notas,
            "costo": float(cita.precio) if cita.precio else 0,
            "cliente": {
                "id": cliente.id,
                "nombre_completo": f"{cliente.nombre} {cliente.apellido}",
                "email": cliente.email,
                "telefono": cliente.telefono
            }
        })
    
    return {"citas": citas_formateadas}


@router.get("/dashboard/citas", status_code=status.HTTP_200_OK)
async def obtener_citas_dashboard(
    fecha_inicio: Optional[str] = None,
    fecha_fin: Optional[str] = None,
    estado: Optional[str] = None,
    current_user: TokenData = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Obtiene todas las citas del profesional con filtros opcionales
    """
    user = db.query(User).filter(User.email == current_user.email).first()
    
    if user.tipo_usuario != TipoUsuario.PROFESIONAL:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los profesionales pueden acceder a sus citas"
        )
    
    # Convertir strings a datetime
    fecha_inicio_dt = datetime.fromisoformat(fecha_inicio) if fecha_inicio else None
    fecha_fin_dt = datetime.fromisoformat(fecha_fin) if fecha_fin else None
    estado_enum = EstadoCita(estado.upper()) if estado else None
    
    citas = obtener_citas_profesional(db, user.id, fecha_inicio_dt, fecha_fin_dt, estado_enum)
    
    # Formatear respuesta
    citas_formateadas = []
    for cita in citas:
        cliente = db.query(User).filter(User.id == cita.cliente_id).first()
        citas_formateadas.append({
            "id": cita.id,
            "fecha_hora": cita.fecha_hora.isoformat(),
            "duracion_minutos": cita.duracion_minutos,
            "estado": cita.estado.value,
            "motivo": cita.motivo,
            "notas": cita.notas,
            "costo": float(cita.precio) if cita.precio else 0,
            "cliente": {
                "id": cliente.id,
                "nombre_completo": f"{cliente.nombre} {cliente.apellido}",
                "email": cliente.email,
                "telefono": cliente.telefono
            }
        })
    
    return {"citas": citas_formateadas, "total": len(citas_formateadas)}


@router.get("/dashboard/citas-del-dia", status_code=status.HTTP_200_OK)
async def obtener_citas_del_dia_dashboard(
    fecha: str = Query(..., description="Fecha en formato YYYY-MM-DD"),
    current_user: TokenData = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Obtiene todas las citas de un día específico
    """
    user = db.query(User).filter(User.email == current_user.email).first()
    
    if user.tipo_usuario != TipoUsuario.PROFESIONAL:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los profesionales pueden acceder a sus citas"
        )
    
    try:
        fecha_dt = datetime.strptime(fecha, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Formato de fecha inválido. Use YYYY-MM-DD"
        )
    
    citas = obtener_citas_del_dia(db, user.id, fecha_dt)
    
    # Formatear respuesta
    citas_formateadas = []
    for cita in citas:
        cliente = db.query(User).filter(User.id == cita.cliente_id).first()
        citas_formateadas.append({
            "id": cita.id,
            "fecha_hora": cita.fecha_hora.isoformat(),
            "duracion_minutos": cita.duracion_minutos,
            "estado": cita.estado.value,
            "motivo": cita.motivo,
            "notas": cita.notas,
            "costo": float(cita.precio) if cita.precio else 0,
            "cliente": {
                "id": cliente.id,
                "nombre_completo": f"{cliente.nombre} {cliente.apellido}",
                "email": cliente.email,
                "telefono": cliente.telefono
            }
        })
    
    return {"fecha": fecha, "citas": citas_formateadas, "total": len(citas_formateadas)}


@router.put("/dashboard/citas/{cita_id}/estado", status_code=status.HTTP_200_OK)
async def actualizar_estado_cita_dashboard(
    cita_id: int,
    nuevo_estado: str,
    current_user: TokenData = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Actualiza el estado de una cita
    Estados válidos: PENDIENTE, CONFIRMADA, CANCELADA, COMPLETADA
    """
    user = db.query(User).filter(User.email == current_user.email).first()
    
    if user.tipo_usuario != TipoUsuario.PROFESIONAL:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los profesionales pueden actualizar el estado de sus citas"
        )
    
    try:
        estado_enum = EstadoCita(nuevo_estado.lower())
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Estado inválido. Estados válidos: {', '.join([e.value for e in EstadoCita])}"
        )
    
    cita = actualizar_estado_cita(db, cita_id, user.id, estado_enum)
    
    if not cita:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cita no encontrada o no pertenece a este profesional"
        )
    
    return {
        "message": "Estado de la cita actualizado correctamente",
        "cita_id": cita.id,
        "nuevo_estado": cita.estado.value
    }


@router.get("/dashboard/horarios-disponibles", status_code=status.HTTP_200_OK)
async def obtener_horarios_disponibles_dashboard(
    fecha: str = Query(..., description="Fecha en formato YYYY-MM-DD"),
    duracion: int = Query(60, ge=15, le=240, description="Duración de la cita en minutos"),
    current_user: TokenData = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Obtiene los horarios disponibles para un día específico
    """
    user = db.query(User).filter(User.email == current_user.email).first()
    
    if user.tipo_usuario != TipoUsuario.PROFESIONAL:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los profesionales pueden consultar sus horarios"
        )
    
    try:
        fecha_dt = datetime.strptime(fecha, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Formato de fecha inválido. Use YYYY-MM-DD"
        )
    
    horarios = obtener_horarios_disponibles(db, user.id, fecha_dt, duracion)
    
    return {
        "fecha": fecha,
        "duracion_minutos": duracion,
        "horarios_disponibles": horarios,
        "total": len(horarios)
    }


@router.get("/dashboard/pacientes", status_code=status.HTTP_200_OK)
async def obtener_pacientes_profesional(
    current_user: TokenData = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Obtiene todos los pacientes (clientes) que han tenido citas con el profesional
    """
    user = db.query(User).filter(User.email == current_user.email).first()
    
    if user.tipo_usuario != TipoUsuario.PROFESIONAL:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los profesionales pueden acceder a sus pacientes"
        )
    
    # Obtener clientes únicos que han tenido citas con este profesional
    citas = db.query(Cita).filter(Cita.profesional_id == user.id).all()
    
    # Obtener IDs únicos de clientes
    cliente_ids = list(set([cita.cliente_id for cita in citas]))
    
    # Obtener información de los clientes
    pacientes = []
    for cliente_id in cliente_ids:
        cliente = db.query(User).filter(User.id == cliente_id).first()
        if cliente:
            # Contar citas del cliente con este profesional
            total_citas = db.query(Cita).filter(
                Cita.profesional_id == user.id,
                Cita.cliente_id == cliente_id
            ).count()
            
            # Obtener última cita
            ultima_cita = db.query(Cita).filter(
                Cita.profesional_id == user.id,
                Cita.cliente_id == cliente_id
            ).order_by(Cita.fecha_hora.desc()).first()
            
            pacientes.append({
                "id": cliente.id,
                "name": f"{cliente.nombre} {cliente.apellido}",
                "email": cliente.email,
                "phone": cliente.telefono,
                "total_citas": total_citas,
                "ultima_cita": ultima_cita.fecha_hora.isoformat() if ultima_cita else None,
                "status": "active" if cliente.is_active else "inactive"
            })
    
    return {"patients": pacientes}


# ============= ENDPOINTS DE PAGOS =============

@router.get("/dashboard/pagos", status_code=status.HTTP_200_OK)
async def obtener_pagos_profesional(
    fecha_inicio: Optional[str] = Query(None),
    fecha_fin: Optional[str] = Query(None),
    estado: Optional[str] = Query(None),
    current_user: TokenData = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Obtiene el historial de pagos del profesional
    """
    from models import Pago, EstadoPago
    from sqlalchemy import and_
    
    user = db.query(User).filter(User.email == current_user.email).first()
    if user.tipo_usuario != TipoUsuario.PROFESIONAL:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los profesionales pueden consultar pagos"
        )
    
    # Query base: pagos de citas del profesional
    query = db.query(Pago, Cita, User).join(
        Cita, Pago.cita_id == Cita.id
    ).join(
        User, Cita.cliente_id == User.id
    ).filter(
        Cita.profesional_id == user.id
    )
    
    # Filtros opcionales
    if fecha_inicio:
        fecha_inicio_dt = datetime.strptime(fecha_inicio, "%Y-%m-%d")
        query = query.filter(Pago.created_at >= fecha_inicio_dt)
    
    if fecha_fin:
        fecha_fin_dt = datetime.strptime(fecha_fin, "%Y-%m-%d")
        # Añadir 1 día para incluir todo el día final
        fecha_fin_dt = fecha_fin_dt + timedelta(days=1)
        query = query.filter(Pago.created_at < fecha_fin_dt)
    
    if estado:
        try:
            estado_enum = EstadoPago(estado.lower())
            query = query.filter(Pago.estado == estado_enum)
        except ValueError:
            pass
    
    resultados = query.order_by(Pago.created_at.desc()).all()
    
    pagos_formateados = []
    for pago, cita, cliente in resultados:
        pagos_formateados.append({
            "id": f"PAY-{pago.id:03d}",
            "pago_id": pago.id,
            "cita_id": cita.id,
            "patient": f"{cliente.nombre} {cliente.apellido}",
            "date": pago.created_at.isoformat() if pago.created_at else cita.fecha_hora.isoformat(),
            "amount": float(pago.monto) if pago.monto else 0,
            "status": pago.estado.value,
            "method": pago.metodo_pago or "No especificado",
            "concept": cita.motivo or "Consulta",
            "notes": cita.notas or "",
            "referencia": pago.referencia_transaccion
        })
    
    return {"pagos": pagos_formateados, "total": len(pagos_formateados)}


@router.get("/dashboard/pagos/estadisticas", status_code=status.HTTP_200_OK)
async def obtener_estadisticas_pagos(
    current_user: TokenData = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Obtiene estadísticas de pagos del profesional
    """
    from models import Pago, EstadoPago
    from sqlalchemy import func
    
    user = db.query(User).filter(User.email == current_user.email).first()
    if user.tipo_usuario != TipoUsuario.PROFESIONAL:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los profesionales pueden consultar estadísticas"
        )
    
    # Total ingresos
    total_ingresos = db.query(func.sum(Pago.monto)).join(
        Cita, Pago.cita_id == Cita.id
    ).filter(
        Cita.profesional_id == user.id,
        Pago.estado == EstadoPago.COMPLETADO
    ).scalar() or 0
    
    # Pendientes
    pendientes = db.query(func.sum(Pago.monto)).join(
        Cita, Pago.cita_id == Cita.id
    ).filter(
        Cita.profesional_id == user.id,
        Pago.estado == EstadoPago.PENDIENTE
    ).scalar() or 0
    
    # Completados
    completados = db.query(func.count(Pago.id)).join(
        Cita, Pago.cita_id == Cita.id
    ).filter(
        Cita.profesional_id == user.id,
        Pago.estado == EstadoPago.COMPLETADO
    ).scalar() or 0
    
    # Fallidos
    fallidos = db.query(func.count(Pago.id)).join(
        Cita, Pago.cita_id == Cita.id
    ).filter(
        Cita.profesional_id == user.id,
        Pago.estado == EstadoPago.FALLIDO
    ).scalar() or 0
    
    # Total pagos
    total_pagos = db.query(func.count(Pago.id)).join(
        Cita, Pago.cita_id == Cita.id
    ).filter(
        Cita.profesional_id == user.id
    ).scalar() or 0
    
    return {
        "total": float(total_ingresos),
        "pending": float(pendientes),
        "completed": completados,
        "failed": fallidos,
        "total_count": total_pagos
    }
