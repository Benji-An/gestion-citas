-- Migración: Agregar campos adicionales a la tabla users
-- Fecha: 2025-11-20

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS fecha_nacimiento TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS genero VARCHAR(50),
ADD COLUMN IF NOT EXISTS direccion VARCHAR(255),
ADD COLUMN IF NOT EXISTS ciudad VARCHAR(100),
ADD COLUMN IF NOT EXISTS pais VARCHAR(100),
ADD COLUMN IF NOT EXISTS codigo_postal VARCHAR(20);

-- Verificar que las columnas se crearon correctamente
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('fecha_nacimiento', 'genero', 'direccion', 'ciudad', 'pais', 'codigo_postal');
