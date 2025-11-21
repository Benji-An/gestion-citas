from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum

from database import Base


class TipoUsuario(str, enum.Enum):
    CLIENTE = "cliente"
    PROFESIONAL = "profesional"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    nombre = Column(String(100))
    apellido = Column(String(100))
    telefono = Column(String(20))
    fecha_nacimiento = Column(DateTime(timezone=True), nullable=True)
    genero = Column(String(50), nullable=True)
    direccion = Column(String(255), nullable=True)
    ciudad = Column(String(100), nullable=True)
    pais = Column(String(100), nullable=True)
    codigo_postal = Column(String(20), nullable=True)
    foto_perfil = Column(Text, nullable=True)  # Base64 o URL de la foto
    tipo_usuario = Column(SQLEnum(TipoUsuario), nullable=False)
    is_active = Column(Boolean, default=True)
    
    # Configuración de notificaciones
    notif_email_citas = Column(Boolean, default=True)
    notif_email_cancelaciones = Column(Boolean, default=True)
    notif_email_pagos = Column(Boolean, default=True)
    notif_sms_recordatorios = Column(Boolean, default=False)
    notif_email_marketing = Column(Boolean, default=False)
    
    # Configuración de privacidad
    perfil_publico = Column(Boolean, default=True)
    mostrar_telefono = Column(Boolean, default=False)
    mostrar_email = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relaciones
    # Si es cliente
    citas_cliente = relationship("Cita", back_populates="cliente", foreign_keys="Cita.cliente_id")
    favoritos = relationship("Favorito", back_populates="cliente")
    
    # Si es profesional
    perfil_profesional = relationship("PerfilProfesional", back_populates="usuario", uselist=False)
    citas_profesional = relationship("Cita", back_populates="profesional", foreign_keys="Cita.profesional_id")

    def __repr__(self):
        return f"<User(email='{self.email}', tipo='{self.tipo_usuario}')>"


class PerfilProfesional(Base):
    __tablename__ = "perfiles_profesionales"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    especialidad = Column(String(100))
    descripcion = Column(Text)
    experiencia_anos = Column(Integer)
    precio_consulta = Column(Integer)  # En pesos colombianos
    direccion = Column(String(255))
    ciudad = Column(String(100))
    foto_url = Column(String(255))
    calificacion_promedio = Column(Integer, default=0)  # De 0 a 5
    numero_resenas = Column(Integer, default=0)
    licencia = Column(String(100))  # Número de licencia profesional
    educacion = Column(Text)  # Formación académica
    idiomas = Column(Text)  # Idiomas separados por comas
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relaciones
    usuario = relationship("User", back_populates="perfil_profesional")
    disponibilidad = relationship("Disponibilidad", back_populates="profesional")
    
    def __repr__(self):
        return f"<PerfilProfesional(id={self.id}, especialidad='{self.especialidad}')>"


class EstadoCita(str, enum.Enum):
    PENDIENTE = "pendiente"
    CONFIRMADA = "confirmada"
    CANCELADA = "cancelada"
    COMPLETADA = "completada"


class Cita(Base):
    __tablename__ = "citas"

    id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    profesional_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    fecha_hora = Column(DateTime(timezone=True), nullable=False)
    duracion_minutos = Column(Integer, default=60)
    estado = Column(SQLEnum(EstadoCita), default=EstadoCita.PENDIENTE)
    motivo = Column(Text)
    notas = Column(Text)
    precio = Column(Integer)  # En pesos colombianos
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relaciones
    cliente = relationship("User", back_populates="citas_cliente", foreign_keys=[cliente_id])
    profesional = relationship("User", back_populates="citas_profesional", foreign_keys=[profesional_id])
    pago = relationship("Pago", back_populates="cita", uselist=False)

    def __repr__(self):
        return f"<Cita(id={self.id}, estado='{self.estado}')>"


class EstadoPago(str, enum.Enum):
    PENDIENTE = "pendiente"
    COMPLETADO = "completado"
    FALLIDO = "fallido"
    REEMBOLSADO = "reembolsado"


class Pago(Base):
    __tablename__ = "pagos"

    id = Column(Integer, primary_key=True, index=True)
    cita_id = Column(Integer, ForeignKey("citas.id"), unique=True, nullable=False)
    monto = Column(Integer, nullable=False)  # En pesos colombianos
    estado = Column(SQLEnum(EstadoPago), default=EstadoPago.PENDIENTE)
    metodo_pago = Column(String(50))  # tarjeta, efectivo, transferencia, etc.
    referencia_transaccion = Column(String(255))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relaciones
    cita = relationship("Cita", back_populates="pago")

    def __repr__(self):
        return f"<Pago(id={self.id}, monto={self.monto}, estado='{self.estado}')>"


class DiaSemana(str, enum.Enum):
    LUNES = "lunes"
    MARTES = "martes"
    MIERCOLES = "miercoles"
    JUEVES = "jueves"
    VIERNES = "viernes"
    SABADO = "sabado"
    DOMINGO = "domingo"


class Disponibilidad(Base):
    __tablename__ = "disponibilidad"

    id = Column(Integer, primary_key=True, index=True)
    profesional_id = Column(Integer, ForeignKey("perfiles_profesionales.id"), nullable=False)
    dia_semana = Column(SQLEnum(DiaSemana), nullable=False)
    hora_inicio = Column(String(5), nullable=False)  # Formato: "09:00"
    hora_fin = Column(String(5), nullable=False)  # Formato: "17:00"
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relaciones
    profesional = relationship("PerfilProfesional", back_populates="disponibilidad")

    def __repr__(self):
        return f"<Disponibilidad(dia='{self.dia_semana}', {self.hora_inicio}-{self.hora_fin})>"


class Favorito(Base):
    __tablename__ = "favoritos"

    id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    profesional_id = Column(Integer, ForeignKey("perfiles_profesionales.id"), nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relaciones
    cliente = relationship("User", back_populates="favoritos")

    def __repr__(self):
        return f"<Favorito(cliente_id={self.cliente_id}, profesional_id={self.profesional_id})>"


class TipoNotificacion(str, enum.Enum):
    CITA_CONFIRMADA = "CITA_CONFIRMADA"
    CITA_CANCELADA = "CITA_CANCELADA"
    CITA_REAGENDADA = "CITA_REAGENDADA"
    RECORDATORIO = "RECORDATORIO"
    PAGO_EXITOSO = "PAGO_EXITOSO"
    PAGO_FALLIDO = "PAGO_FALLIDO"
    MENSAJE = "MENSAJE"
    SISTEMA = "SISTEMA"


class Notificacion(Base):
    __tablename__ = "notificaciones"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    tipo = Column(SQLEnum(TipoNotificacion), nullable=False)
    titulo = Column(String(200), nullable=False)
    mensaje = Column(Text, nullable=False)
    leida = Column(Boolean, default=False)
    cita_id = Column(Integer, ForeignKey("citas.id"), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relaciones
    usuario = relationship("User", backref="notificaciones")
    cita = relationship("Cita", backref="notificaciones")

    def __repr__(self):
        return f"<Notificacion(id={self.id}, tipo='{self.tipo}', leida={self.leida})>"
