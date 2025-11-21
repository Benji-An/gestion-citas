"""
Repositorios - Capa de Acceso a Datos

Esta capa encapsula todas las operaciones SQL y consultas a la base de datos.
Los servicios no deben hacer queries directamente, sino usar los repositorios.
"""

from .user_repository import UserRepository
from .profesional_repository import ProfesionalRepository
from .cita_repository import CitaRepository
from .pago_repository import PagoRepository
from .disponibilidad_repository import DisponibilidadRepository
from .notificacion_repository import NotificacionRepository
from .favorito_repository import FavoritoRepository

__all__ = [
    'UserRepository',
    'ProfesionalRepository',
    'CitaRepository',
    'PagoRepository',
    'DisponibilidadRepository',
    'NotificacionRepository',
    'FavoritoRepository'
]
