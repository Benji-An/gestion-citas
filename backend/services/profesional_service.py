"""
Servicio para la gestión completa de profesionales

Este servicio encapsula toda la lógica de negocio relacionada con:
- Perfiles profesionales y búsqueda
- Disponibilidad y horarios
- Estadísticas y métricas
- Gestión de citas
- Configuración de privacidad y notificaciones
"""

from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from typing import List, Dict, Optional, Any
from fastapi import HTTPException, status

from models import (
    Cita, EstadoCita, User, Pago, EstadoPago, 
    PerfilProfesional, Disponibilidad, DiaSemana,
    TipoUsuario, Favorito
)

def obtener_estadisticas_profesional(db: Session, profesional_id: int) -> Dict:
    """
    Obtiene las estadísticas del profesional
    """
    # Citas totales
    total_citas = db.query(Cita).filter(
        Cita.profesional_id == profesional_id
    ).count()
    
    # Citas completadas
    citas_completadas = db.query(Cita).filter(
        Cita.profesional_id == profesional_id,
        Cita.estado == EstadoCita.COMPLETADA
    ).count()
    
    # Citas pendientes
    citas_pendientes = db.query(Cita).filter(
        Cita.profesional_id == profesional_id,
        Cita.estado == EstadoCita.PENDIENTE
    ).count()
    
    # Citas confirmadas
    citas_confirmadas = db.query(Cita).filter(
        Cita.profesional_id == profesional_id,
        Cita.estado == EstadoCita.CONFIRMADA
    ).count()
    
    # Ingresos totales (citas completadas con pagos completados)
    ingresos = db.query(func.sum(Pago.monto)).join(
        Cita, Pago.cita_id == Cita.id
    ).filter(
        Cita.profesional_id == profesional_id,
        Pago.estado == EstadoPago.COMPLETADO
    ).scalar() or 0
    
    # Ingresos del mes actual
    inicio_mes = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    ingresos_mes = db.query(func.sum(Pago.monto)).join(
        Cita, Pago.cita_id == Cita.id
    ).filter(
        Cita.profesional_id == profesional_id,
        Pago.estado == EstadoPago.COMPLETADO,
        Pago.created_at >= inicio_mes
    ).scalar() or 0
    
    return {
        "total_citas": total_citas,
        "citas_completadas": citas_completadas,
        "citas_pendientes": citas_pendientes,
        "citas_confirmadas": citas_confirmadas,
        "ingresos_totales": float(ingresos),
        "ingresos_mes_actual": float(ingresos_mes)
    }


def obtener_citas_profesional(
    db: Session,
    profesional_id: int,
    fecha_inicio: Optional[datetime] = None,
    fecha_fin: Optional[datetime] = None,
    estado: Optional[EstadoCita] = None
) -> List[Cita]:
    """
    Obtiene las citas del profesional con filtros opcionales
    """
    query = db.query(Cita).filter(Cita.profesional_id == profesional_id)
    
    if fecha_inicio:
        query = query.filter(Cita.fecha_hora >= fecha_inicio)
    
    if fecha_fin:
        query = query.filter(Cita.fecha_hora <= fecha_fin)
    
    if estado:
        query = query.filter(Cita.estado == estado)
    
    return query.order_by(Cita.fecha_hora.asc()).all()


def obtener_proximas_citas(db: Session, profesional_id: int, limit: int = 5) -> List[Cita]:
    """
    Obtiene las próximas citas del profesional
    """
    ahora = datetime.now()
    
    return db.query(Cita).filter(
        Cita.profesional_id == profesional_id,
        Cita.fecha_hora >= ahora,
        or_(
            Cita.estado == EstadoCita.CONFIRMADA,
            Cita.estado == EstadoCita.PENDIENTE
        )
    ).order_by(Cita.fecha_hora.asc()).limit(limit).all()


def obtener_citas_del_dia(db: Session, profesional_id: int, fecha: datetime) -> List[Cita]:
    """
    Obtiene todas las citas de un día específico
    """
    inicio_dia = fecha.replace(hour=0, minute=0, second=0, microsecond=0)
    fin_dia = inicio_dia + timedelta(days=1)
    
    return db.query(Cita).filter(
        Cita.profesional_id == profesional_id,
        Cita.fecha_hora >= inicio_dia,
        Cita.fecha_hora < fin_dia
    ).order_by(Cita.fecha_hora.asc()).all()


def actualizar_estado_cita(
    db: Session,
    cita_id: int,
    profesional_id: int,
    nuevo_estado: EstadoCita
) -> Cita:
    """
    Actualiza el estado de una cita (solo si pertenece al profesional)
    """
    cita = db.query(Cita).filter(
        Cita.id == cita_id,
        Cita.profesional_id == profesional_id
    ).first()
    
    if not cita:
        return None
    
    cita.estado = nuevo_estado
    db.commit()
    db.refresh(cita)
    
    return cita


def obtener_horarios_disponibles(
    db: Session,
    profesional_id: int,
    fecha: datetime,
    duracion_minutos: int = 60
) -> List[str]:
    """
    Calcula los horarios disponibles para un día específico
    Retorna lista de horas disponibles en formato "HH:MM"
    """
    # Obtener citas del día
    citas = obtener_citas_del_dia(db, profesional_id, fecha)
    
    # Horario de trabajo típico: 8:00 - 18:00
    hora_inicio = 8
    hora_fin = 18
    
    # Generar todos los slots posibles
    slots_disponibles = []
    hora_actual = hora_inicio
    minuto_actual = 0
    
    while hora_actual < hora_fin:
        slot_datetime = fecha.replace(hour=hora_actual, minute=minuto_actual, second=0, microsecond=0)
        slot_fin = slot_datetime + timedelta(minutes=duracion_minutos)
        
        # Verificar si hay conflicto con alguna cita existente
        conflicto = False
        for cita in citas:
            cita_fin = cita.fecha_hora + timedelta(minutes=cita.duracion_minutos)
            
            # Hay conflicto si los rangos se solapan
            if (slot_datetime < cita_fin and slot_fin > cita.fecha_hora):
                conflicto = True
                break
        
        if not conflicto:
            slots_disponibles.append(f"{hora_actual:02d}:{minuto_actual:02d}")
        
        # Avanzar al siguiente slot (cada 30 minutos)
        minuto_actual += 30
        if minuto_actual >= 60:
            minuto_actual = 0
            hora_actual += 1
    
    return slots_disponibles


def obtener_disponibilidad_profesional(db: Session, profesional_id: int) -> List[Dict]:
    """
    Obtiene todos los bloques de disponibilidad del profesional
    """
    # Primero obtener el perfil profesional
    perfil = db.query(PerfilProfesional).filter(
        PerfilProfesional.user_id == profesional_id
    ).first()
    
    if not perfil:
        return []
    
    disponibilidad = db.query(Disponibilidad).filter(
        Disponibilidad.profesional_id == perfil.id
    ).all()
    
    return [{
        "id": d.id,
        "dia_semana": d.dia_semana.value,
        "hora_inicio": d.hora_inicio,
        "hora_fin": d.hora_fin
    } for d in disponibilidad]


def crear_disponibilidad(
    db: Session, 
    profesional_id: int, 
    dia_semana: DiaSemana, 
    hora_inicio: str, 
    hora_fin: str
) -> Disponibilidad:
    """
    Crea un nuevo bloque de disponibilidad
    """
    # Obtener perfil profesional
    perfil = db.query(PerfilProfesional).filter(
        PerfilProfesional.user_id == profesional_id
    ).first()
    
    if not perfil:
        raise ValueError("Perfil profesional no encontrado")
    
    disponibilidad = Disponibilidad(
        profesional_id=perfil.id,
        dia_semana=dia_semana,
        hora_inicio=hora_inicio,
        hora_fin=hora_fin
    )
    
    db.add(disponibilidad)
    db.commit()
    db.refresh(disponibilidad)
    
    return disponibilidad


def actualizar_disponibilidad(
    db: Session,
    profesional_id: int,
    disponibilidad_id: int,
    hora_inicio: Optional[str] = None,
    hora_fin: Optional[str] = None
) -> Optional[Disponibilidad]:
    """
    Actualiza un bloque de disponibilidad existente
    """
    # Obtener perfil profesional
    perfil = db.query(PerfilProfesional).filter(
        PerfilProfesional.user_id == profesional_id
    ).first()
    
    if not perfil:
        return None
    
    disponibilidad = db.query(Disponibilidad).filter(
        Disponibilidad.id == disponibilidad_id,
        Disponibilidad.profesional_id == perfil.id
    ).first()
    
    if not disponibilidad:
        return None
    
    if hora_inicio:
        disponibilidad.hora_inicio = hora_inicio
    if hora_fin:
        disponibilidad.hora_fin = hora_fin
    
    db.commit()
    db.refresh(disponibilidad)
    
    return disponibilidad


def eliminar_disponibilidad(
    db: Session,
    profesional_id: int,
    disponibilidad_id: int
) -> bool:
    """
    Elimina un bloque de disponibilidad
    """
    # Obtener perfil profesional
    perfil = db.query(PerfilProfesional).filter(
        PerfilProfesional.user_id == profesional_id
    ).first()
    
    if not perfil:
        return False
    
    disponibilidad = db.query(Disponibilidad).filter(
        Disponibilidad.id == disponibilidad_id,
        Disponibilidad.profesional_id == perfil.id
    ).first()
    
    if not disponibilidad:
        return False
    
    db.delete(disponibilidad)
    db.commit()
    
    return True


# ==================== NUEVAS FUNCIONES DE PERFIL ====================

def buscar_profesionales(
    db: Session,
    especialidad: Optional[str] = None,
    nombre: Optional[str] = None,
    ciudad: Optional[str] = None,
    precio_min: Optional[float] = None,
    precio_max: Optional[float] = None
) -> List[Dict[str, Any]]:
    """
    Busca profesionales según múltiples criterios
    """
    query = db.query(User, PerfilProfesional).join(
        PerfilProfesional, 
        User.id == PerfilProfesional.user_id
    ).filter(
        User.tipo_usuario == TipoUsuario.profesional,
        User.is_active == True
    )
    
    if especialidad:
        query = query.filter(PerfilProfesional.especialidad.ilike(f"%{especialidad}%"))
    
    if nombre:
        query = query.filter(
            or_(
                User.nombre.ilike(f"%{nombre}%"),
                User.apellido.ilike(f"%{nombre}%")
            )
        )
    
    if ciudad:
        query = query.filter(User.ciudad.ilike(f"%{ciudad}%"))
    
    if precio_min is not None:
        query = query.filter(PerfilProfesional.precio_por_sesion >= precio_min)
    
    if precio_max is not None:
        query = query.filter(PerfilProfesional.precio_por_sesion <= precio_max)
    
    resultados = query.all()
    
    profesionales = []
    for user, perfil in resultados:
        prof_data = {
            "id": user.id,
            "nombre": user.nombre,
            "apellido": user.apellido,
            "email": user.email if perfil.mostrar_email else None,
            "telefono": user.telefono if perfil.mostrar_telefono else None,
            "ciudad": user.ciudad,
            "foto_perfil": user.foto_perfil,
            "especialidad": perfil.especialidad,
            "anos_experiencia": perfil.anos_experiencia,
            "precio_por_sesion": perfil.precio_por_sesion,
            "calificacion_promedio": perfil.calificacion_promedio,
            "total_resenas": perfil.total_resenas,
            "biografia": perfil.biografia
        }
        profesionales.append(prof_data)
    
    return profesionales


def obtener_perfil_profesional_publico(db: Session, profesional_id: int) -> Optional[Dict[str, Any]]:
    """
    Obtiene el perfil público de un profesional (respeta privacidad)
    """
    user = db.query(User).filter(User.id == profesional_id).first()
    
    if not user or user.tipo_usuario != TipoUsuario.profesional:
        return None
    
    perfil = db.query(PerfilProfesional).filter(
        PerfilProfesional.user_id == profesional_id
    ).first()
    
    if not perfil:
        return None
    
    if not perfil.perfil_publico:
        return None
    
    return {
        "id": user.id,
        "nombre": user.nombre,
        "apellido": user.apellido,
        "email": user.email if perfil.mostrar_email else None,
        "telefono": user.telefono if perfil.mostrar_telefono else None,
        "ciudad": user.ciudad,
        "foto_perfil": user.foto_perfil,
        "especialidad": perfil.especialidad,
        "licencia": perfil.licencia,
        "anos_experiencia": perfil.anos_experiencia,
        "educacion": perfil.educacion,
        "idiomas": perfil.idiomas,
        "precio_por_sesion": perfil.precio_por_sesion,
        "direccion_consultorio": perfil.direccion_consultorio,
        "calificacion_promedio": perfil.calificacion_promedio,
        "total_resenas": perfil.total_resenas,
        "biografia": perfil.biografia
    }


def obtener_perfil_propio(db: Session, user_id: int) -> Dict[str, Any]:
    """
    Obtiene el perfil completo del profesional autenticado (sin restricciones)
    """
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    perfil = db.query(PerfilProfesional).filter(
        PerfilProfesional.user_id == user_id
    ).first()
    
    if not perfil:
        # Crear perfil si no existe
        perfil = PerfilProfesional(user_id=user_id)
        db.add(perfil)
        db.commit()
        db.refresh(perfil)
    
    return {
        "id": user.id,
        "email": user.email,
        "nombre": user.nombre,
        "apellido": user.apellido,
        "telefono": user.telefono,
        "fecha_nacimiento": user.fecha_nacimiento,
        "genero": user.genero,
        "direccion": user.direccion,
        "ciudad": user.ciudad,
        "pais": user.pais,
        "codigo_postal": user.codigo_postal,
        "foto_perfil": user.foto_perfil,
        "especialidad": perfil.especialidad,
        "licencia": perfil.licencia,
        "anos_experiencia": perfil.anos_experiencia,
        "educacion": perfil.educacion,
        "idiomas": perfil.idiomas,
        "precio_por_sesion": perfil.precio_por_sesion,
        "direccion_consultorio": perfil.direccion_consultorio,
        "calificacion_promedio": perfil.calificacion_promedio,
        "total_resenas": perfil.total_resenas,
        "biografia": perfil.biografia,
        "notificaciones": {
            "email_citas": user.notif_email_citas,
            "email_cancelaciones": user.notif_email_cancelaciones,
            "email_pagos": user.notif_email_pagos,
            "sms_recordatorios": user.notif_sms_recordatorios,
            "email_marketing": user.notif_email_marketing
        },
        "privacidad": {
            "perfil_publico": perfil.perfil_publico,
            "mostrar_telefono": perfil.mostrar_telefono,
            "mostrar_email": perfil.mostrar_email
        }
    }


def actualizar_perfil_profesional(
    db: Session,
    user_id: int,
    **kwargs
) -> Dict[str, Any]:
    """
    Actualiza el perfil del profesional con todos los campos posibles
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    perfil = db.query(PerfilProfesional).filter(
        PerfilProfesional.user_id == user_id
    ).first()
    
    if not perfil:
        perfil = PerfilProfesional(user_id=user_id)
        db.add(perfil)
    
    # Actualizar campos de usuario
    campos_usuario = [
        'nombre', 'apellido', 'telefono', 'fecha_nacimiento', 
        'genero', 'direccion', 'ciudad', 'pais', 'codigo_postal', 'foto_perfil'
    ]
    
    for campo in campos_usuario:
        if campo in kwargs and kwargs[campo] is not None:
            setattr(user, campo, kwargs[campo])
    
    # Actualizar campos de perfil profesional
    campos_perfil = [
        'especialidad', 'licencia', 'anos_experiencia', 'educacion',
        'idiomas', 'precio_por_sesion', 'direccion_consultorio', 
        'biografia', 'perfil_publico', 'mostrar_telefono', 'mostrar_email'
    ]
    
    for campo in campos_perfil:
        if campo in kwargs and kwargs[campo] is not None:
            setattr(perfil, campo, kwargs[campo])
    
    # Actualizar configuración de notificaciones
    campos_notificaciones = [
        'notif_email_citas', 'notif_email_cancelaciones',
        'notif_email_pagos', 'notif_sms_recordatorios',
        'notif_email_marketing'
    ]
    
    for campo in campos_notificaciones:
        if campo in kwargs and kwargs[campo] is not None:
            setattr(user, campo, kwargs[campo])
    
    db.commit()
    db.refresh(user)
    db.refresh(perfil)
    
    return obtener_perfil_propio(db, user_id)


def actualizar_horarios_disponibilidad(
    db: Session,
    profesional_id: int,
    horarios: Dict[str, Dict[str, Any]]
) -> Dict[str, str]:
    """
    Actualiza los horarios de disponibilidad de forma completa
    """
    dias_validos = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
    
    # Eliminar disponibilidades antiguas
    db.query(Disponibilidad).filter(
        Disponibilidad.profesional_id == profesional_id
    ).delete()
    
    # Crear nuevas disponibilidades
    for dia, config in horarios.items():
        dia_normalizado = dia.lower()
        
        if dia_normalizado not in dias_validos:
            continue
        
        if not config.get('activo', False):
            continue
        
        try:
            hora_inicio = datetime.strptime(config['hora_inicio'], '%H:%M').time()
            hora_fin = datetime.strptime(config['hora_fin'], '%H:%M').time()
        except (ValueError, KeyError):
            continue
        
        nueva_disponibilidad = Disponibilidad(
            profesional_id=profesional_id,
            dia_semana=dia_normalizado,
            hora_inicio=hora_inicio,
            hora_fin=hora_fin,
            disponible=True
        )
        db.add(nueva_disponibilidad)
    
    db.commit()
    
    return {"message": "Horarios actualizados correctamente"}


# ==================== FUNCIONES DE FAVORITOS ====================

def agregar_favorito(db: Session, cliente_id: int, profesional_id: int) -> Dict[str, str]:
    """Agrega un profesional a favoritos"""
    profesional = db.query(User).filter(
        User.id == profesional_id,
        User.tipo_usuario == TipoUsuario.profesional
    ).first()
    
    if not profesional:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profesional no encontrado"
        )
    
    favorito_existente = db.query(Favorito).filter(
        Favorito.cliente_id == cliente_id,
        Favorito.profesional_id == profesional_id
    ).first()
    
    if favorito_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El profesional ya está en favoritos"
        )
    
    favorito = Favorito(cliente_id=cliente_id, profesional_id=profesional_id)
    db.add(favorito)
    db.commit()
    
    return {"message": "Profesional agregado a favoritos"}


def eliminar_favorito(db: Session, cliente_id: int, profesional_id: int) -> Dict[str, str]:
    """Elimina un profesional de favoritos"""
    favorito = db.query(Favorito).filter(
        Favorito.cliente_id == cliente_id,
        Favorito.profesional_id == profesional_id
    ).first()
    
    if not favorito:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Favorito no encontrado"
        )
    
    db.delete(favorito)
    db.commit()
    
    return {"message": "Profesional eliminado de favoritos"}


def obtener_favoritos(db: Session, cliente_id: int) -> List[Dict[str, Any]]:
    """Obtiene los profesionales favoritos de un cliente"""
    favoritos = db.query(Favorito, User, PerfilProfesional).join(
        User, Favorito.profesional_id == User.id
    ).join(
        PerfilProfesional, User.id == PerfilProfesional.user_id
    ).filter(
        Favorito.cliente_id == cliente_id
    ).all()
    
    return [
        {
            "id": user.id,
            "nombre": user.nombre,
            "apellido": user.apellido,
            "foto_perfil": user.foto_perfil,
            "especialidad": perfil.especialidad,
            "precio_por_sesion": perfil.precio_por_sesion,
            "calificacion_promedio": perfil.calificacion_promedio,
            "agregado_en": favorito.created_at
        }
        for favorito, user, perfil in favoritos
    ]
