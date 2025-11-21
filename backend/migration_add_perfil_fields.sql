-- Migración: Agregar campos de licencia, educación e idiomas al perfil profesional
-- Fecha: 2025-11-21

-- Agregar columnas al perfil profesional
ALTER TABLE perfiles_profesionales
ADD COLUMN IF NOT EXISTS licencia VARCHAR(100),
ADD COLUMN IF NOT EXISTS educacion TEXT,
ADD COLUMN IF NOT EXISTS idiomas TEXT;

-- Comentarios
COMMENT ON COLUMN perfiles_profesionales.licencia IS 'Número de licencia profesional';
COMMENT ON COLUMN perfiles_profesionales.educacion IS 'Formación académica del profesional';
COMMENT ON COLUMN perfiles_profesionales.idiomas IS 'Idiomas que habla el profesional, separados por comas';
