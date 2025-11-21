-- Migración: Agregar campo foto_perfil a la tabla users
-- Fecha: 2025-11-20

ALTER TABLE users ADD COLUMN IF NOT EXISTS foto_perfil TEXT;

-- Verificar que se agregó correctamente
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'foto_perfil';
