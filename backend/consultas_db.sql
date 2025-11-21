-- ================================================
-- CONSULTAS ÚTILES PARA LA BASE DE DATOS TIIWA
-- ================================================

-- ====================================
-- 1. CONSULTAS BÁSICAS DE USUARIOS
-- ====================================

-- Ver todos los usuarios
SELECT * FROM users;

-- Ver solo usuarios activos
SELECT id, email, nombre, apellido, tipo_usuario, is_active 
FROM users 
WHERE is_active = true;

-- Contar usuarios por tipo
SELECT tipo_usuario, COUNT(*) as total
FROM users
GROUP BY tipo_usuario;

-- Ver usuarios con sus datos completos
SELECT 
    id,
    email,
    nombre || ' ' || apellido as nombre_completo,
    telefono,
    tipo_usuario,
    is_active,
    created_at
FROM users
ORDER BY created_at DESC;


-- ====================================
-- 2. CONSULTAS DE PROFESIONALES
-- ====================================

-- Ver todos los profesionales con su perfil
SELECT 
    u.id,
    u.email,
    u.nombre || ' ' || u.apellido as nombre_completo,
    pp.especialidad,
    pp.precio_consulta,
    pp.ciudad,
    pp.calificacion_promedio,
    pp.experiencia_anos
FROM users u
INNER JOIN perfiles_profesionales pp ON u.id = pp.usuario_id
WHERE u.tipo_usuario = 'profesional'
ORDER BY pp.calificacion_promedio DESC;

-- Ver profesionales por especialidad
SELECT 
    pp.especialidad,
    COUNT(*) as cantidad_profesionales,
    AVG(pp.precio_consulta) as precio_promedio
FROM perfiles_profesionales pp
GROUP BY pp.especialidad;

-- Ver profesionales con mejor calificación
SELECT 
    u.nombre || ' ' || u.apellido as profesional,
    pp.especialidad,
    pp.calificacion_promedio,
    pp.numero_resenas,
    pp.precio_consulta
FROM users u
INNER JOIN perfiles_profesionales pp ON u.id = pp.usuario_id
WHERE pp.calificacion_promedio >= 4
ORDER BY pp.calificacion_promedio DESC, pp.numero_resenas DESC;


-- ====================================
-- 3. CONSULTAS DE CITAS
-- ====================================

-- Ver todas las citas con información de cliente y profesional
SELECT 
    c.id,
    cliente.nombre || ' ' || cliente.apellido as cliente,
    profesional.nombre || ' ' || profesional.apellido as profesional,
    c.fecha_hora,
    c.estado,
    c.precio,
    c.motivo
FROM citas c
INNER JOIN users cliente ON c.cliente_id = cliente.id
INNER JOIN users profesional ON c.profesional_id = profesional.id
ORDER BY c.fecha_hora DESC;

-- Contar citas por estado
SELECT estado, COUNT(*) as total
FROM citas
GROUP BY estado;

-- Ver citas pendientes
SELECT 
    c.id,
    cliente.email as email_cliente,
    profesional.email as email_profesional,
    c.fecha_hora,
    c.estado,
    c.precio
FROM citas c
INNER JOIN users cliente ON c.cliente_id = cliente.id
INNER JOIN users profesional ON c.profesional_id = profesional.id
WHERE c.estado = 'pendiente'
ORDER BY c.fecha_hora ASC;

-- Citas del día (cambiar la fecha según necesites)
SELECT 
    c.id,
    cliente.nombre || ' ' || cliente.apellido as cliente,
    profesional.nombre || ' ' || profesional.apellido as profesional,
    c.fecha_hora,
    c.estado
FROM citas c
INNER JOIN users cliente ON c.cliente_id = cliente.id
INNER JOIN users profesional ON c.profesional_id = profesional.id
WHERE DATE(c.fecha_hora) = CURRENT_DATE
ORDER BY c.fecha_hora;


-- ====================================
-- 4. CONSULTAS DE PAGOS
-- ====================================

-- Ver todos los pagos con información de la cita
SELECT 
    p.id,
    p.monto,
    p.estado as estado_pago,
    p.metodo_pago,
    c.fecha_hora as fecha_cita,
    c.estado as estado_cita,
    cliente.email as cliente
FROM pagos p
INNER JOIN citas c ON p.cita_id = c.id
INNER JOIN users cliente ON c.cliente_id = cliente.id
ORDER BY p.created_at DESC;

-- Total de ingresos por estado de pago
SELECT 
    estado,
    COUNT(*) as cantidad_pagos,
    SUM(monto) as total_monto
FROM pagos
GROUP BY estado;

-- Pagos completados del mes actual
SELECT 
    DATE(p.created_at) as fecha,
    COUNT(*) as cantidad,
    SUM(p.monto) as total_ingresos
FROM pagos p
WHERE p.estado = 'completado' 
    AND EXTRACT(MONTH FROM p.created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
    AND EXTRACT(YEAR FROM p.created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
GROUP BY DATE(p.created_at)
ORDER BY fecha DESC;


-- ====================================
-- 5. CONSULTAS DE DISPONIBILIDAD
-- ====================================

-- Ver disponibilidad de todos los profesionales
SELECT 
    u.nombre || ' ' || u.apellido as profesional,
    pp.especialidad,
    d.dia_semana,
    d.hora_inicio,
    d.hora_fin
FROM disponibilidad d
INNER JOIN perfiles_profesionales pp ON d.profesional_id = pp.id
INNER JOIN users u ON pp.usuario_id = u.id
ORDER BY u.apellido, d.dia_semana;

-- Disponibilidad de un día específico
SELECT 
    u.nombre || ' ' || u.apellido as profesional,
    pp.especialidad,
    d.hora_inicio,
    d.hora_fin
FROM disponibilidad d
INNER JOIN perfiles_profesionales pp ON d.profesional_id = pp.id
INNER JOIN users u ON pp.usuario_id = u.id
WHERE d.dia_semana = 'lunes'  -- Cambiar según el día
ORDER BY d.hora_inicio;


-- ====================================
-- 6. CONSULTAS DE FAVORITOS
-- ====================================

-- Ver profesionales favoritos de cada cliente
SELECT 
    cliente.nombre || ' ' || cliente.apellido as cliente,
    profesional.nombre || ' ' || profesional.apellido as profesional_favorito,
    pp.especialidad,
    pp.precio_consulta
FROM favoritos f
INNER JOIN users cliente ON f.cliente_id = cliente.id
INNER JOIN perfiles_profesionales pp ON f.profesional_id = pp.id
INNER JOIN users profesional ON pp.usuario_id = profesional.id
ORDER BY cliente.apellido;

-- Profesionales más agregados a favoritos
SELECT 
    u.nombre || ' ' || u.apellido as profesional,
    pp.especialidad,
    COUNT(*) as veces_agregado_favoritos
FROM favoritos f
INNER JOIN perfiles_profesionales pp ON f.profesional_id = pp.id
INNER JOIN users u ON pp.usuario_id = u.id
GROUP BY u.nombre, u.apellido, pp.especialidad
ORDER BY veces_agregado_favoritos DESC;


-- ====================================
-- 7. ESTADÍSTICAS GENERALES
-- ====================================

-- Resumen general del sistema
SELECT 
    (SELECT COUNT(*) FROM users WHERE tipo_usuario = 'cliente') as total_clientes,
    (SELECT COUNT(*) FROM users WHERE tipo_usuario = 'profesional') as total_profesionales,
    (SELECT COUNT(*) FROM users WHERE tipo_usuario = 'admin') as total_admins,
    (SELECT COUNT(*) FROM citas) as total_citas,
    (SELECT COUNT(*) FROM citas WHERE estado = 'pendiente') as citas_pendientes,
    (SELECT COUNT(*) FROM citas WHERE estado = 'completada') as citas_completadas,
    (SELECT SUM(monto) FROM pagos WHERE estado = 'completado') as ingresos_totales;

-- Actividad reciente (últimos 7 días)
SELECT 
    'Usuario' as tipo,
    COUNT(*) as cantidad
FROM users
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
UNION ALL
SELECT 
    'Cita' as tipo,
    COUNT(*) as cantidad
FROM citas
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
UNION ALL
SELECT 
    'Pago' as tipo,
    COUNT(*) as cantidad
FROM pagos
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days';


-- ====================================
-- 8. CONSULTAS DE VERIFICACIÓN
-- ====================================

-- Verificar integridad: Usuarios sin perfil profesional (siendo profesionales)
SELECT 
    u.id,
    u.email,
    u.nombre || ' ' || u.apellido as nombre_completo
FROM users u
LEFT JOIN perfiles_profesionales pp ON u.id = pp.usuario_id
WHERE u.tipo_usuario = 'profesional' AND pp.id IS NULL;

-- Verificar citas sin pago
SELECT 
    c.id,
    c.fecha_hora,
    c.estado,
    c.precio,
    cliente.email as cliente
FROM citas c
LEFT JOIN pagos p ON c.id = p.cita_id
INNER JOIN users cliente ON c.cliente_id = cliente.id
WHERE p.id IS NULL;


-- ====================================
-- 9. CONSULTAS PARA REPORTES
-- ====================================

-- Reporte mensual de citas por profesional
SELECT 
    profesional.nombre || ' ' || profesional.apellido as profesional,
    COUNT(*) as total_citas,
    SUM(CASE WHEN c.estado = 'completada' THEN 1 ELSE 0 END) as completadas,
    SUM(CASE WHEN c.estado = 'cancelada' THEN 1 ELSE 0 END) as canceladas,
    SUM(c.precio) as ingresos_potenciales
FROM citas c
INNER JOIN users profesional ON c.profesional_id = profesional.id
WHERE EXTRACT(MONTH FROM c.fecha_hora) = EXTRACT(MONTH FROM CURRENT_DATE)
GROUP BY profesional.nombre, profesional.apellido
ORDER BY total_citas DESC;

-- Top 10 clientes más activos
SELECT 
    u.nombre || ' ' || u.apellido as cliente,
    u.email,
    COUNT(c.id) as total_citas,
    SUM(CASE WHEN c.estado = 'completada' THEN 1 ELSE 0 END) as citas_completadas
FROM users u
INNER JOIN citas c ON u.id = c.cliente_id
WHERE u.tipo_usuario = 'cliente'
GROUP BY u.nombre, u.apellido, u.email
ORDER BY total_citas DESC
LIMIT 10;


-- ====================================
-- 10. CONSULTAS DE LIMPIEZA/MANTENIMIENTO
-- ====================================

-- Eliminar citas antiguas canceladas (más de 6 meses)
-- DELETE FROM citas 
-- WHERE estado = 'cancelada' 
--     AND fecha_hora < CURRENT_DATE - INTERVAL '6 months';

-- Desactivar usuarios sin actividad (descomentar para usar)
-- UPDATE users 
-- SET is_active = false 
-- WHERE id NOT IN (SELECT DISTINCT cliente_id FROM citas WHERE created_at >= CURRENT_DATE - INTERVAL '1 year');
