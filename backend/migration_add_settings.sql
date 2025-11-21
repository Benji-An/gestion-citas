-- Migración: Agregar campos de configuración de notificaciones y privacidad
-- Fecha: 2025-11-21

-- Agregar columnas de configuración de notificaciones
ALTER TABLE users
ADD COLUMN IF NOT EXISTS notif_email_citas BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS notif_email_cancelaciones BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS notif_email_pagos BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS notif_sms_recordatorios BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS notif_email_marketing BOOLEAN DEFAULT FALSE;

-- Agregar columnas de configuración de privacidad
ALTER TABLE users
ADD COLUMN IF NOT EXISTS perfil_publico BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS mostrar_telefono BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS mostrar_email BOOLEAN DEFAULT TRUE;

-- Comentarios
COMMENT ON COLUMN users.notif_email_citas IS 'Recibir notificaciones por email de nuevas citas';
COMMENT ON COLUMN users.notif_email_cancelaciones IS 'Recibir notificaciones por email de cancelaciones';
COMMENT ON COLUMN users.notif_email_pagos IS 'Recibir notificaciones por email de pagos';
COMMENT ON COLUMN users.notif_sms_recordatorios IS 'Recibir recordatorios por SMS';
COMMENT ON COLUMN users.notif_email_marketing IS 'Recibir emails de marketing';
COMMENT ON COLUMN users.perfil_publico IS 'Perfil visible para otros usuarios';
COMMENT ON COLUMN users.mostrar_telefono IS 'Mostrar teléfono en perfil público';
COMMENT ON COLUMN users.mostrar_email IS 'Mostrar email en perfil público';
