"""
Utilidades para crear notificaciones en diferentes eventos del sistema
"""
from sqlalchemy.orm import Session
from models import Notificacion, TipoNotificacion, User, Cita
from datetime import datetime


def crear_notificacion(
    db: Session,
    usuario_id: int,
    tipo: TipoNotificacion,
    titulo: str,
    mensaje: str,
    cita_id: int = None
):
    """
    Crea una notificación para un usuario
    
    Args:
        db: Sesión de base de datos
        usuario_id: ID del usuario que recibirá la notificación
        tipo: Tipo de notificación (enum TipoNotificacion)
        titulo: Título de la notificación
        mensaje: Mensaje de la notificación
        cita_id: ID de la cita relacionada (opcional)
    
    Returns:
        Notificacion: La notificación creada
    """
    notificacion = Notificacion(
        usuario_id=usuario_id,
        tipo=tipo,
        titulo=titulo,
        mensaje=mensaje,
        leida=False,
        cita_id=cita_id
    )
    
    db.add(notificacion)
    db.commit()
    db.refresh(notificacion)
    
    return notificacion


def notificar_cita_creada(db: Session, cita: Cita, cliente: User, profesional: User):
    """
    Crea notificaciones cuando se agenda una nueva cita
    Notifica tanto al cliente como al profesional
    """
    fecha_str = cita.fecha_hora.strftime("%d/%m/%Y a las %H:%M")
    
    # Notificación para el cliente
    crear_notificacion(
        db=db,
        usuario_id=cliente.id,
        tipo=TipoNotificacion.CITA_CONFIRMADA,
        titulo="Cita agendada exitosamente",
        mensaje=f"Tu cita con {profesional.nombre} {profesional.apellido} ha sido agendada para el {fecha_str}.",
        cita_id=cita.id
    )
    
    # Notificación para el profesional
    crear_notificacion(
        db=db,
        usuario_id=profesional.id,
        tipo=TipoNotificacion.CITA_CONFIRMADA,
        titulo="Nueva cita agendada",
        mensaje=f"{cliente.nombre} {cliente.apellido} ha agendado una cita para el {fecha_str}.",
        cita_id=cita.id
    )


def notificar_cita_cancelada(db: Session, cita: Cita, cliente: User, profesional: User, cancelado_por: str):
    """
    Crea notificaciones cuando se cancela una cita
    
    Args:
        cancelado_por: "cliente" o "profesional"
    """
    fecha_str = cita.fecha_hora.strftime("%d/%m/%Y a las %H:%M")
    
    if cancelado_por == "cliente":
        # Notificar al profesional
        crear_notificacion(
            db=db,
            usuario_id=profesional.id,
            tipo=TipoNotificacion.CITA_CANCELADA,
            titulo="Cita cancelada",
            mensaje=f"{cliente.nombre} {cliente.apellido} ha cancelado la cita del {fecha_str}.",
            cita_id=cita.id
        )
        
        # Confirmar al cliente
        crear_notificacion(
            db=db,
            usuario_id=cliente.id,
            tipo=TipoNotificacion.CITA_CANCELADA,
            titulo="Cita cancelada",
            mensaje=f"Tu cita con {profesional.nombre} {profesional.apellido} del {fecha_str} ha sido cancelada.",
            cita_id=cita.id
        )
    else:
        # Notificar al cliente
        crear_notificacion(
            db=db,
            usuario_id=cliente.id,
            tipo=TipoNotificacion.CITA_CANCELADA,
            titulo="Cita cancelada",
            mensaje=f"{profesional.nombre} {profesional.apellido} ha cancelado la cita del {fecha_str}. Por favor, agenda una nueva cita.",
            cita_id=cita.id
        )


def notificar_cita_reagendada(db: Session, cita: Cita, cliente: User, profesional: User, nueva_fecha: datetime):
    """
    Crea notificaciones cuando se reagenda una cita
    """
    nueva_fecha_str = nueva_fecha.strftime("%d/%m/%Y a las %H:%M")
    
    # Notificación para el cliente
    crear_notificacion(
        db=db,
        usuario_id=cliente.id,
        tipo=TipoNotificacion.CITA_REAGENDADA,
        titulo="Cita reagendada",
        mensaje=f"Tu cita con {profesional.nombre} {profesional.apellido} ha sido reagendada para el {nueva_fecha_str}.",
        cita_id=cita.id
    )
    
    # Notificación para el profesional
    crear_notificacion(
        db=db,
        usuario_id=profesional.id,
        tipo=TipoNotificacion.CITA_REAGENDADA,
        titulo="Cita reagendada",
        mensaje=f"La cita con {cliente.nombre} {cliente.apellido} ha sido reagendada para el {nueva_fecha_str}.",
        cita_id=cita.id
    )


def notificar_pago_exitoso(db: Session, cita: Cita, cliente: User, monto: float, referencia: str):
    """
    Crea notificación cuando se realiza un pago exitoso
    """
    monto_str = f"${monto:,.0f}"
    fecha_str = cita.fecha_hora.strftime("%d/%m/%Y a las %H:%M")
    
    crear_notificacion(
        db=db,
        usuario_id=cliente.id,
        tipo=TipoNotificacion.PAGO_EXITOSO,
        titulo="Pago procesado exitosamente",
        mensaje=f"Tu pago de {monto_str} COP para la cita del {fecha_str} ha sido procesado. Referencia: {referencia}",
        cita_id=cita.id
    )


def notificar_pago_fallido(db: Session, cliente_id: int, monto: float):
    """
    Crea notificación cuando falla un pago
    """
    monto_str = f"${monto:,.0f}"
    
    crear_notificacion(
        db=db,
        usuario_id=cliente_id,
        tipo=TipoNotificacion.PAGO_FALLIDO,
        titulo="Error en el pago",
        mensaje=f"No se pudo procesar tu pago de {monto_str} COP. Por favor, intenta nuevamente con otro método de pago.",
        cita_id=None
    )


def notificar_recordatorio_cita(db: Session, cita: Cita, cliente: User, profesional: User):
    """
    Crea notificación de recordatorio para una cita próxima (24 horas antes)
    """
    fecha_str = cita.fecha_hora.strftime("%d/%m/%Y a las %H:%M")
    
    # Recordatorio para el cliente
    crear_notificacion(
        db=db,
        usuario_id=cliente.id,
        tipo=TipoNotificacion.RECORDATORIO,
        titulo="Recordatorio: Cita mañana",
        mensaje=f"Recuerda tu cita con {profesional.nombre} {profesional.apellido} mañana {fecha_str}.",
        cita_id=cita.id
    )
    
    # Recordatorio para el profesional
    crear_notificacion(
        db=db,
        usuario_id=profesional.id,
        tipo=TipoNotificacion.RECORDATORIO,
        titulo="Recordatorio: Cita mañana",
        mensaje=f"Recuerda tu cita con {cliente.nombre} {cliente.apellido} mañana {fecha_str}.",
        cita_id=cita.id
    )


def notificar_bienvenida_usuario(db: Session, usuario: User):
    """
    Crea notificación de bienvenida para un nuevo usuario
    """
    if usuario.tipo_usuario.value == "cliente":
        mensaje = "¡Bienvenido a Tiiwa! Ahora puedes buscar profesionales de la salud y agendar citas fácilmente."
    elif usuario.tipo_usuario.value == "profesional":
        mensaje = "¡Bienvenido a Tiiwa! Configura tu perfil y disponibilidad para empezar a recibir citas."
    else:
        mensaje = "¡Bienvenido a Tiiwa!"
    
    crear_notificacion(
        db=db,
        usuario_id=usuario.id,
        tipo=TipoNotificacion.SISTEMA,
        titulo="¡Bienvenido a Tiiwa!",
        mensaje=mensaje,
        cita_id=None
    )
