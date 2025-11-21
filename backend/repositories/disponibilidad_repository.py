"""
Repositorio para operaciones de disponibilidad
"""

from typing import Optional, List
from datetime import datetime, date
from sqlalchemy.orm import Session

from models import Disponibilidad


class DisponibilidadRepository:
    """Repositorio para gestionar disponibilidad de profesionales"""
    
    @staticmethod
    def crear(db: Session, disponibilidad_data: dict) -> Disponibilidad:
        """Crea un bloque de disponibilidad"""
        disponibilidad = Disponibilidad(**disponibilidad_data)
        db.add(disponibilidad)
        db.commit()
        db.refresh(disponibilidad)
        return disponibilidad
    
    @staticmethod
    def obtener_por_id(db: Session, disponibilidad_id: int) -> Optional[Disponibilidad]:
        """Obtiene disponibilidad por ID"""
        return db.query(Disponibilidad).filter(
            Disponibilidad.id == disponibilidad_id
        ).first()
    
    @staticmethod
    def obtener_por_profesional(
        db: Session,
        profesional_id: int,
        solo_disponibles: bool = False
    ) -> List[Disponibilidad]:
        """Obtiene disponibilidad de un profesional"""
        query = db.query(Disponibilidad).filter(
            Disponibilidad.profesional_id == profesional_id
        )
        
        if solo_disponibles:
            query = query.filter(Disponibilidad.disponible == True)
        
        return query.all()
    
    @staticmethod
    def obtener_por_dia(
        db: Session,
        profesional_id: int,
        dia_semana: str
    ) -> List[Disponibilidad]:
        """Obtiene disponibilidad de un día específico"""
        return db.query(Disponibilidad).filter(
            Disponibilidad.profesional_id == profesional_id,
            Disponibilidad.dia_semana == dia_semana.lower()
        ).all()
    
    @staticmethod
    def obtener_por_fecha(
        db: Session,
        profesional_id: int,
        fecha: date
    ) -> List[Disponibilidad]:
        """Obtiene disponibilidad para una fecha específica"""
        return db.query(Disponibilidad).filter(
            Disponibilidad.profesional_id == profesional_id,
            Disponibilidad.fecha == fecha
        ).all()
    
    @staticmethod
    def actualizar(
        db: Session,
        disponibilidad_id: int,
        **campos
    ) -> Optional[Disponibilidad]:
        """Actualiza campos de disponibilidad"""
        disponibilidad = DisponibilidadRepository.obtener_por_id(db, disponibilidad_id)
        if not disponibilidad:
            return None
        
        for campo, valor in campos.items():
            if hasattr(disponibilidad, campo):
                setattr(disponibilidad, campo, valor)
        
        db.commit()
        db.refresh(disponibilidad)
        return disponibilidad
    
    @staticmethod
    def eliminar(db: Session, disponibilidad_id: int) -> bool:
        """Elimina un bloque de disponibilidad"""
        disponibilidad = DisponibilidadRepository.obtener_por_id(db, disponibilidad_id)
        if not disponibilidad:
            return False
        
        db.delete(disponibilidad)
        db.commit()
        return True
    
    @staticmethod
    def eliminar_por_profesional(db: Session, profesional_id: int) -> int:
        """Elimina toda la disponibilidad de un profesional"""
        count = db.query(Disponibilidad).filter(
            Disponibilidad.profesional_id == profesional_id
        ).delete()
        db.commit()
        return count
    
    @staticmethod
    def actualizar_masivo(
        db: Session,
        profesional_id: int,
        horarios: dict
    ) -> bool:
        """Actualiza horarios de forma masiva"""
        # Primero eliminar todo
        DisponibilidadRepository.eliminar_por_profesional(db, profesional_id)
        
        # Crear nuevos horarios
        dias_validos = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
        
        for dia, config in horarios.items():
            dia_normalizado = dia.lower()
            
            if dia_normalizado not in dias_validos:
                continue
            
            if not config.get('activo', False):
                continue
            
            try:
                from datetime import datetime
                hora_inicio = datetime.strptime(config['hora_inicio'], '%H:%M').time()
                hora_fin = datetime.strptime(config['hora_fin'], '%H:%M').time()
                
                DisponibilidadRepository.crear(db, {
                    'profesional_id': profesional_id,
                    'dia_semana': dia_normalizado,
                    'hora_inicio': hora_inicio,
                    'hora_fin': hora_fin,
                    'disponible': True
                })
            except (ValueError, KeyError):
                continue
        
        return True
    
    @staticmethod
    def verificar_disponibilidad(
        db: Session,
        profesional_id: int,
        dia_semana: str,
        hora: datetime
    ) -> bool:
        """Verifica si un profesional está disponible en un horario"""
        disponibilidades = DisponibilidadRepository.obtener_por_dia(
            db, profesional_id, dia_semana
        )
        
        hora_time = hora.time()
        
        for disp in disponibilidades:
            if disp.hora_inicio <= hora_time <= disp.hora_fin and disp.disponible:
                return True
        
        return False
    
    @staticmethod
    def tiene_disponibilidad(db: Session, profesional_id: int) -> bool:
        """Verifica si el profesional tiene alguna disponibilidad configurada"""
        return db.query(Disponibilidad).filter(
            Disponibilidad.profesional_id == profesional_id,
            Disponibilidad.disponible == True
        ).first() is not None
