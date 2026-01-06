-- Consultas SQL para la base de datos de chistes

-- Consulta 1: Saca todos los chistes creados por el usuario "Manolito"
SELECT j.id, j.text, j.created_at, u.name as user_name, t.name as theme_name
FROM jokes j
JOIN users u ON j.user_id = u.id
JOIN themes t ON j.theme_id = t.id
WHERE u.name = 'Manolito';

-- Consulta 2: Saca todos los chistes de la temática "humor negro"
SELECT j.id, j.text, j.created_at, u.name as user_name, t.name as theme_name
FROM jokes j
JOIN users u ON j.user_id = u.id
JOIN themes t ON j.theme_id = t.id
WHERE t.name = 'humor negro';

-- Consulta 3: Saca todos los chistes de la temática "humor negro" creados por el usuario "Manolito"
SELECT j.id, j.text, j.created_at, u.name as user_name, t.name as theme_name
FROM jokes j
JOIN users u ON j.user_id = u.id
JOIN themes t ON j.theme_id = t.id
WHERE u.name = 'Manolito' AND t.name = 'humor negro';

-- Consultas adicionales útiles

-- Ver todos los usuarios
SELECT * FROM users;

-- Ver todas las temáticas
SELECT * FROM themes;

-- Contar chistes por usuario
SELECT u.name, COUNT(j.id) as total_jokes
FROM users u
LEFT JOIN jokes j ON u.id = j.user_id
GROUP BY u.id, u.name;

-- Contar chistes por temática
SELECT t.name, COUNT(j.id) as total_jokes
FROM themes t
LEFT JOIN jokes j ON t.id = j.theme_id
GROUP BY t.id, t.name;

-- Ver todos los chistes con sus relaciones
SELECT j.id, j.text, u.name as usuario, t.name as tematica, j.created_at
FROM jokes j
JOIN users u ON j.user_id = u.id
JOIN themes t ON j.theme_id = t.id
ORDER BY j.created_at DESC;
