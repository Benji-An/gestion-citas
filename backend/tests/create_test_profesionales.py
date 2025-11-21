from sqlalchemy.orm import Session
from database import SessionLocal, init_db
from models import User, PerfilProfesional
from security import get_password_hash

def create_test_profesionales():
    """Crear perfiles profesionales de prueba con datos completos"""
    
    # Primero inicializar DB
    init_db()
    
    db = SessionLocal()
    
    try:
        # Verificar si ya existen profesionales
        existing_count = db.query(PerfilProfesional).count()
        if existing_count > 0:
            print(f"✅ Ya existen {existing_count} perfiles profesionales en la base de datos")
            return
        
        # Crear usuarios profesionales con sus perfiles
        profesionales_data = [
            {
                "user": {
                    "email": "dra.garcia@tiiwa.com",
                    "nombre": "María",
                    "apellido": "García",
                    "telefono": "3001234567",
                    "tipo_usuario": "profesional"
                },
                "perfil": {
                    "especialidad": "Psicología",
                    "descripcion": "Especialista en terapia cognitivo-conductual con enfoque en ansiedad y depresión. Atención personalizada y confidencial.",
                    "experiencia_anos": 8,
                    "precio_consulta": 80000,
                    "direccion": "Carrera 7 #45-30, Consultorio 302",
                    "ciudad": "Bogotá",
                    "calificacion_promedio": 4.8,
                    "numero_resenas": 45
                }
            },
            {
                "user": {
                    "email": "dr.rodriguez@tiiwa.com",
                    "nombre": "Carlos",
                    "apellido": "Rodríguez",
                    "telefono": "3009876543",
                    "tipo_usuario": "profesional"
                },
                "perfil": {
                    "especialidad": "Nutrición",
                    "descripcion": "Nutricionista deportivo con enfoque en alimentación saludable y planes personalizados para pérdida de peso.",
                    "experiencia_anos": 5,
                    "precio_consulta": 65000,
                    "direccion": "Avenida 68 #23-10, Piso 4",
                    "ciudad": "Bogotá",
                    "calificacion_promedio": 4.6,
                    "numero_resenas": 32
                }
            },
            {
                "user": {
                    "email": "ft.martinez@tiiwa.com",
                    "nombre": "Ana",
                    "apellido": "Martínez",
                    "telefono": "3155551234",
                    "tipo_usuario": "profesional"
                },
                "perfil": {
                    "especialidad": "Fisioterapia",
                    "descripcion": "Fisioterapeuta especializada en rehabilitación deportiva y lesiones musculares. Técnicas modernas y efectivas.",
                    "experiencia_anos": 10,
                    "precio_consulta": 75000,
                    "direccion": "Calle 100 #15-20, Centro Médico",
                    "ciudad": "Medellín",
                    "calificacion_promedio": 4.9,
                    "numero_resenas": 68
                }
            },
            {
                "user": {
                    "email": "dra.lopez@tiiwa.com",
                    "nombre": "Laura",
                    "apellido": "López",
                    "telefono": "3178889999",
                    "tipo_usuario": "profesional"
                },
                "perfil": {
                    "especialidad": "Dermatología",
                    "descripcion": "Dermatóloga con experiencia en tratamientos faciales, acné y enfermedades de la piel. Atención integral.",
                    "experiencia_anos": 12,
                    "precio_consulta": 95000,
                    "direccion": "Carrera 15 #78-45, Clínica Estética",
                    "ciudad": "Cali",
                    "calificacion_promedio": 4.7,
                    "numero_resenas": 56
                }
            },
            {
                "user": {
                    "email": "dr.ramirez@tiiwa.com",
                    "nombre": "Miguel",
                    "apellido": "Ramírez",
                    "telefono": "3209876543",
                    "tipo_usuario": "profesional"
                },
                "perfil": {
                    "especialidad": "Cardiología",
                    "descripcion": "Cardiólogo especializado en prevención y tratamiento de enfermedades cardiovasculares. Atención de calidad.",
                    "experiencia_anos": 15,
                    "precio_consulta": 120000,
                    "direccion": "Calle 50 #12-30, Hospital Central",
                    "ciudad": "Barranquilla",
                    "calificacion_promedio": 4.9,
                    "numero_resenas": 89
                }
            },
            {
                "user": {
                    "email": "dra.torres@tiiwa.com",
                    "nombre": "Sofia",
                    "apellido": "Torres",
                    "telefono": "3123456789",
                    "tipo_usuario": "profesional"
                },
                "perfil": {
                    "especialidad": "Odontología",
                    "descripcion": "Odontóloga general con especialización en ortodoncia y estética dental. Tratamientos sin dolor.",
                    "experiencia_anos": 7,
                    "precio_consulta": 70000,
                    "direccion": "Avenida Norte #34-56, Consultorio 205",
                    "ciudad": "Bogotá",
                    "calificacion_promedio": 4.8,
                    "numero_resenas": 41
                }
            },
            {
                "user": {
                    "email": "psi.gonzalez@tiiwa.com",
                    "nombre": "David",
                    "apellido": "González",
                    "telefono": "3198765432",
                    "tipo_usuario": "profesional"
                },
                "perfil": {
                    "especialidad": "Psicología",
                    "descripcion": "Psicólogo clínico especializado en terapia de pareja y familiar. Enfoque humanista y empático.",
                    "experiencia_anos": 6,
                    "precio_consulta": 85000,
                    "direccion": "Carrera 11 #67-89, Edificio Salud",
                    "ciudad": "Medellín",
                    "calificacion_promedio": 4.5,
                    "numero_resenas": 28
                }
            },
            {
                "user": {
                    "email": "nut.sanchez@tiiwa.com",
                    "nombre": "Patricia",
                    "apellido": "Sánchez",
                    "telefono": "3165554321",
                    "tipo_usuario": "profesional"
                },
                "perfil": {
                    "especialidad": "Nutrición",
                    "descripcion": "Nutricionista especializada en nutrición infantil y alimentación vegetariana/vegana. Asesoría completa.",
                    "experiencia_anos": 9,
                    "precio_consulta": 68000,
                    "direccion": "Calle 72 #8-45, Centro Nutricional",
                    "ciudad": "Cali",
                    "calificacion_promedio": 4.7,
                    "numero_resenas": 37
                }
            },
            {
                "user": {
                    "email": "ft.castro@tiiwa.com",
                    "nombre": "Roberto",
                    "apellido": "Castro",
                    "telefono": "3187776655",
                    "tipo_usuario": "profesional"
                },
                "perfil": {
                    "especialidad": "Fisioterapia",
                    "descripcion": "Fisioterapeuta experto en dolor crónico y terapia manual. Tratamientos personalizados y efectivos.",
                    "experiencia_anos": 11,
                    "precio_consulta": 78000,
                    "direccion": "Avenida 39 #20-15, Centro de Rehabilitación",
                    "ciudad": "Bogotá",
                    "calificacion_promedio": 4.6,
                    "numero_resenas": 52
                }
            }
        ]
        
        print("🔄 Creando profesionales de prueba...")
        
        for prof_data in profesionales_data:
            # Crear usuario
            user = User(
                email=prof_data["user"]["email"],
                hashed_password=get_password_hash("prof123"),  # Misma contraseña para todos
                nombre=prof_data["user"]["nombre"],
                apellido=prof_data["user"]["apellido"],
                telefono=prof_data["user"]["telefono"],
                tipo_usuario=prof_data["user"]["tipo_usuario"]
            )
            db.add(user)
            db.flush()  # Para obtener el ID del usuario
            
            # Crear perfil profesional
            perfil = PerfilProfesional(
                usuario_id=user.id,
                **prof_data["perfil"]
            )
            db.add(perfil)
            
            print(f"✅ Creado: {user.nombre} {user.apellido} - {prof_data['perfil']['especialidad']}")
        
        db.commit()
        print(f"\n✅ Se crearon {len(profesionales_data)} perfiles profesionales exitosamente")
        print("\n📋 Credenciales de acceso:")
        print("   Email: [cualquier email de arriba]")
        print("   Password: prof123")
        
    except Exception as e:
        print(f"❌ Error al crear profesionales: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_profesionales()
