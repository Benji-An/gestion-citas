-- Migración: Crear tabla de notificaciones
-- Fecha: 2025-11-20

CREATE TABLE IF NOT EXISTS notificaciones (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    leida BOOLEAN DEFAULT FALSE,
    cita_id INTEGER REFERENCES citas(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_notificaciones_usuario ON notificaciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_leida ON notificaciones(leida);
CREATE INDEX IF NOT EXISTS idx_notificaciones_created ON notificaciones(created_at DESC);

-- Insertar algunas notificaciones de ejemplo para el usuario con ID 2
INSERT INTO notificaciones (usuario_id, tipo, titulo, mensaje, leida, cita_id) VALUES
(2, 'SISTEMA', 'Bienvenido a Tiiwa', 'Gracias por registrarte en nuestra plataforma. Ahora puedes buscar profesionales y agendar citas.', false, NULL),
(2, 'RECORDATORIO', 'Recordatorio de Cita', 'Tienes una cita programada para mañana. No olvides confirmar tu asistencia.', false, NULL),
(2, 'MENSAJE', 'Nueva Característica', 'Ahora puedes guardar tus profesionales favoritos para acceder rápidamente a ellos.', true, NULL);

-- Verificar que se creó correctamente
SELECT COUNT(*) as total_notificaciones FROM notificaciones;
