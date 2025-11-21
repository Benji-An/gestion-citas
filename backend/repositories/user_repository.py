"""
Repositorio para operaciones de usuarios en la base de datos
"""

from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import or_

from models import User, TipoUsuario


class UserRepository:
    """Repositorio para gestionar operaciones CRUD de usuarios"""
    
    @staticmethod
    def crear(db: Session, user_data: dict) -> User:
        """Crea un nuevo usuario"""
        user = User(**user_data)
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def obtener_por_id(db: Session, user_id: int) -> Optional[User]:
        """Obtiene un usuario por ID"""
        return db.query(User).filter(User.id == user_id).first()
    
    @staticmethod
    def obtener_por_email(db: Session, email: str) -> Optional[User]:
        """Obtiene un usuario por email"""
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def obtener_todos(
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        tipo_usuario: Optional[TipoUsuario] = None,
        activo: Optional[bool] = None
    ) -> List[User]:
        """Obtiene lista de usuarios con filtros opcionales"""
        query = db.query(User)
        
        if tipo_usuario:
            query = query.filter(User.tipo_usuario == tipo_usuario)
        
        if activo is not None:
            query = query.filter(User.is_active == activo)
        
        return query.offset(skip).limit(limit).all()
    
    @staticmethod
    def actualizar(db: Session, user_id: int, **campos) -> Optional[User]:
        """Actualiza campos de un usuario"""
        user = UserRepository.obtener_por_id(db, user_id)
        if not user:
            return None
        
        for campo, valor in campos.items():
            if hasattr(user, campo) and valor is not None:
                setattr(user, campo, valor)
        
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def actualizar_password(db: Session, user_id: int, hashed_password: str) -> bool:
        """Actualiza la contraseña de un usuario"""
        user = UserRepository.obtener_por_id(db, user_id)
        if not user:
            return False
        
        user.hashed_password = hashed_password
        db.commit()
        return True
    
    @staticmethod
    def eliminar(db: Session, user_id: int) -> bool:
        """Elimina un usuario (soft delete)"""
        user = UserRepository.obtener_por_id(db, user_id)
        if not user:
            return False
        
        user.is_active = False
        db.commit()
        return True
    
    @staticmethod
    def buscar(
        db: Session, 
        query: str, 
        tipo_usuario: Optional[TipoUsuario] = None
    ) -> List[User]:
        """Busca usuarios por nombre, apellido o email"""
        search_query = db.query(User).filter(
            or_(
                User.nombre.ilike(f"%{query}%"),
                User.apellido.ilike(f"%{query}%"),
                User.email.ilike(f"%{query}%")
            )
        )
        
        if tipo_usuario:
            search_query = search_query.filter(User.tipo_usuario == tipo_usuario)
        
        return search_query.all()
    
    @staticmethod
    def contar_por_tipo(db: Session, tipo_usuario: TipoUsuario) -> int:
        """Cuenta usuarios por tipo"""
        return db.query(User).filter(User.tipo_usuario == tipo_usuario).count()
    
    @staticmethod
    def existe_email(db: Session, email: str) -> bool:
        """Verifica si existe un email"""
        return db.query(User).filter(User.email == email).first() is not None
