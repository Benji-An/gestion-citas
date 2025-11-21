from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    telefono: Optional[str] = None
    fecha_nacimiento: Optional[datetime] = None
    genero: Optional[str] = None
    direccion: Optional[str] = None
    ciudad: Optional[str] = None
    pais: Optional[str] = None
    codigo_postal: Optional[str] = None
    foto_perfil: Optional[str] = None


class UserCreate(UserBase):
    password: str
    tipo_usuario: Optional[str] = None  # 'cliente', 'profesional', 'admin'


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class User(UserBase):
    id: int
    tipo_usuario: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None
    tipo_usuario: Optional[str] = None


class CambiarContrasena(BaseModel):
    current_password: str
    new_password: str


# ==================== CITAS ====================

class CitaCreate(BaseModel):
    profesional_id: int
    fecha_hora: datetime
    duracion_minutos: int = 60
    motivo: str
    notas: Optional[str] = None
    precio: float


class CitaUpdate(BaseModel):
    fecha_hora: Optional[datetime] = None
    motivo: Optional[str] = None
    notas: Optional[str] = None


class ProfesionalInfo(BaseModel):
    id: int
    nombre_completo: str
    especialidad: Optional[str]
    foto_url: Optional[str] = None
    telefono: Optional[str] = None
    direccion: Optional[str] = None


class CitaResponse(BaseModel):
    id: int
    fecha_hora: datetime
    duracion_minutos: int
    estado: str
    motivo: str
    notas: Optional[str]
    precio: float
    profesional: ProfesionalInfo


# ==================== PAGOS ====================

class PagoCreate(BaseModel):
    cita_id: int
    monto: float
    metodo_pago: str  # 'tarjeta', 'pse', 'efectivo', etc.


class CitaInfo(BaseModel):
    fecha_hora: datetime
    motivo: str
    estado: str
    duracion_minutos: Optional[int] = None


class ProfesionalInfoPago(BaseModel):
    nombre_completo: str
    especialidad: Optional[str]
    telefono: Optional[str] = None


class PagoResponse(BaseModel):
    id: int
    cita_id: int
    monto: float
    estado: str
    metodo_pago: str
    referencia_transaccion: Optional[str]
    fecha_pago: datetime  # Mapeado desde created_at
    cita: CitaInfo
    profesional: ProfesionalInfoPago


# ==================== PERFIL ====================

class PerfilUpdate(BaseModel):
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[EmailStr] = None
    fecha_nacimiento: Optional[datetime] = None
    genero: Optional[str] = None
    direccion: Optional[str] = None
    ciudad: Optional[str] = None
    pais: Optional[str] = None
    codigo_postal: Optional[str] = None
    foto_perfil: Optional[str] = None


class PasswordChange(BaseModel):
    password_actual: str
    password_nuevo: str


# ==================== NOTIFICACIONES ====================

class NotificacionBase(BaseModel):
    titulo: str
    mensaje: str
    tipo: str
    cita_id: Optional[int] = None


class NotificacionCreate(NotificacionBase):
    usuario_id: int


class NotificacionResponse(NotificacionBase):
    id: int
    leida: bool
    created_at: datetime

    class Config:
        from_attributes = True


class MarcarLeidaRequest(BaseModel):
    notificacion_ids: list[int]


# ==================== PAYPAL ====================

class PayPalPagoRequest(BaseModel):
    cita_id: int
