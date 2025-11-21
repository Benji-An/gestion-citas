"""
Repositorio para operaciones de perfiles profesionales
"""

from typing import Optional, List, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, func

from models import User, PerfilProfesional, TipoUsuario


class ProfesionalRepository:
    """Repositorio para gestionar perfiles profesionales"""
    
    @staticmethod
    def crear_perfil(db: Session, user_id: int, **datos) -> PerfilProfesional:
        """Crea un perfil profesional"""
        perfil = PerfilProfesional(user_id=user_id, **datos)
        db.add(perfil)
        db.commit()
        db.refresh(perfil)
        return perfil
    
    @staticmethod
    def obtener_perfil(db: Session, user_id: int) -> Optional[PerfilProfesional]:
        """Obtiene el perfil profesional de un usuario"""
        return db.query(PerfilProfesional).filter(
            PerfilProfesional.user_id == user_id
        ).first()
    
    @staticmethod
    def obtener_perfil_con_usuario(
        db: Session, 
        user_id: int
    ) -> Optional[Tuple[User, PerfilProfesional]]:
        """Obtiene el usuario y perfil profesional juntos"""
        return db.query(User, PerfilProfesional).join(
            PerfilProfesional,
            User.id == PerfilProfesional.user_id
        ).filter(User.id == user_id).first()
    
    @staticmethod
    def actualizar_perfil(
        db: Session, 
        user_id: int, 
        **campos
    ) -> Optional[PerfilProfesional]:
        """Actualiza campos del perfil profesional"""
        perfil = ProfesionalRepository.obtener_perfil(db, user_id)
        if not perfil:
            return None
        
        for campo, valor in campos.items():
            if hasattr(perfil, campo) and valor is not None:
                setattr(perfil, campo, valor)
        
        db.commit()
        db.refresh(perfil)
        return perfil
    
    @staticmethod
    def buscar_profesionales(
        db: Session,
        especialidad: Optional[str] = None,
        ciudad: Optional[str] = None,
        nombre: Optional[str] = None,
        precio_min: Optional[float] = None,
        precio_max: Optional[float] = None,
        solo_publicos: bool = True,
        skip: int = 0,
        limit: int = 100
    ) -> List[Tuple[User, PerfilProfesional]]:
        """Busca profesionales con filtros"""
        query = db.query(User, PerfilProfesional).join(
            PerfilProfesional,
            User.id == PerfilProfesional.user_id
        ).filter(
            User.tipo_usuario == TipoUsuario.profesional,
            User.is_active == True
        )
        
        if solo_publicos:
            query = query.filter(PerfilProfesional.perfil_publico == True)
        
        if especialidad:
            query = query.filter(
                PerfilProfesional.especialidad.ilike(f"%{especialidad}%")
            )
        
        if ciudad:
            query = query.filter(User.ciudad.ilike(f"%{ciudad}%"))
        
        if nombre:
            query = query.filter(
                or_(
                    User.nombre.ilike(f"%{nombre}%"),
                    User.apellido.ilike(f"%{nombre}%")
                )
            )
        
        if precio_min is not None:
            query = query.filter(PerfilProfesional.precio_por_sesion >= precio_min)
        
        if precio_max is not None:
            query = query.filter(PerfilProfesional.precio_por_sesion <= precio_max)
        
        return query.order_by(
            PerfilProfesional.calificacion_promedio.desc()
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def obtener_todos_profesionales(
        db: Session,
        skip: int = 0,
        limit: int = 100
    ) -> List[Tuple[User, PerfilProfesional]]:
        """Obtiene todos los profesionales activos"""
        return db.query(User, PerfilProfesional).join(
            PerfilProfesional,
            User.id == PerfilProfesional.user_id
        ).filter(
            User.tipo_usuario == TipoUsuario.profesional,
            User.is_active == True
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def contar_profesionales(db: Session, **filtros) -> int:
        """Cuenta profesionales con filtros opcionales"""
        query = db.query(User).join(
            PerfilProfesional,
            User.id == PerfilProfesional.user_id
        ).filter(
            User.tipo_usuario == TipoUsuario.profesional,
            User.is_active == True
        )
        
        if 'especialidad' in filtros:
            query = query.filter(
                PerfilProfesional.especialidad.ilike(f"%{filtros['especialidad']}%")
            )
        
        return query.count()
    
    @staticmethod
    def obtener_especialidades_unicas(db: Session) -> List[str]:
        """Obtiene lista de especialidades únicas"""
        especialidades = db.query(
            PerfilProfesional.especialidad
        ).filter(
            PerfilProfesional.especialidad.isnot(None)
        ).distinct().all()
        
        return [esp[0] for esp in especialidades if esp[0]]
    
    @staticmethod
    def actualizar_calificacion(
        db: Session,
        profesional_id: int,
        nueva_calificacion: float,
        incrementar_resenas: bool = True
    ) -> bool:
        """Actualiza la calificación promedio de un profesional"""
        perfil = ProfesionalRepository.obtener_perfil(db, profesional_id)
        if not perfil:
            return False
        
        # Recalcular promedio
        total_actual = perfil.calificacion_promedio * perfil.total_resenas
        perfil.total_resenas += 1 if incrementar_resenas else 0
        perfil.calificacion_promedio = (
            (total_actual + nueva_calificacion) / perfil.total_resenas
        )
        
        db.commit()
        return True
    
    @staticmethod
    def obtener_mejores_calificados(
        db: Session,
        limit: int = 10
    ) -> List[Tuple[User, PerfilProfesional]]:
        """Obtiene profesionales mejor calificados"""
        return db.query(User, PerfilProfesional).join(
            PerfilProfesional,
            User.id == PerfilProfesional.user_id
        ).filter(
            User.tipo_usuario == TipoUsuario.profesional,
            User.is_active == True,
            PerfilProfesional.perfil_publico == True
        ).order_by(
            PerfilProfesional.calificacion_promedio.desc(),
            PerfilProfesional.total_resenas.desc()
        ).limit(limit).all()
