# Ejemplos de Uso de la API

Este documento contiene ejemplos prácticos de cómo usar todos los endpoints de la API.

## Requisitos

- El servidor debe estar ejecutándose en `http://localhost:3000`
- Puedes usar `curl`, Postman, o cualquier cliente HTTP

## Endpoints de Chistes

### 1. Obtener chiste aleatorio

```bash
curl http://localhost:3000/chistes
```

**Respuesta esperada:**
```json
{
  "joke": "Chuck Norris can divide by zero.",
  "source": "Chuck"
}
```

### 2. Obtener chiste de Chuck Norris

```bash
curl http://localhost:3000/chistes/Chuck
```

### 3. Obtener chiste de Dad Jokes

```bash
curl http://localhost:3000/chistes/Dad
```

### 4. Guardar un chiste

```bash
curl -X POST http://localhost:3000/chistes \
  -H "Content-Type: application/json" \
  -d '{
    "text": "¿Por qué los pájaros vuelan hacia el sur? Porque caminando tardarían mucho más.",
    "usuario": "Manolito",
    "tematica": "humor amarillo"
  }'
```

**Respuesta esperada:**
```json
{
  "id": 37,
  "text": "¿Por qué los pájaros vuelan hacia el sur? Porque caminando tardarían mucho más.",
  "user": {
    "id": 1,
    "name": "Manolito"
  },
  "theme": {
    "id": 2,
    "name": "humor amarillo"
  }
}
```

**Nota:** La temática se creará automáticamente si no existe (upsert). El usuario también se creará si no existe.

### 5. Actualizar un chiste

```bash
curl -X PUT http://localhost:3000/chistes/1 \
  -H "Content-Type: application/json" \
  -d '{"text": "Chiste actualizado con nuevo texto"}'
```

**Respuesta esperada:**
```json
{
  "id": 1,
  "text": "Chiste actualizado con nuevo texto"
}
```

### 6. Eliminar un chiste

```bash
curl -X DELETE http://localhost:3000/chistes/1
```

**Respuesta esperada:**
```json
{
  "id": 1,
  "deleted": true
}
```

### 7. Obtener chistes emparejados

```bash
curl http://localhost:3000/chistes/emparejados
```

**Respuesta esperada:**
```json
[
  {
    "chuck": "Chuck Norris counted to infinity. Twice.",
    "dad": "Why did the math book look sad? Because it had too many problems.",
    "combinado": "Chuck Norris counted to infinity. Twice. Also, why did the math book look sad? because it had too many problems."
  },
  {
    "chuck": "Chuck Norris can divide by zero.",
    "dad": "I don't trust stairs. They're always up to something.",
    "combinado": "Chuck Norris can divide by zero. Also, i don't trust stairs. they're always up to something."
  }
  // ... 3 más
]
```

## Endpoints Matemáticos

### 1. Calcular MCM (Mínimo Común Múltiplo)

```bash
curl "http://localhost:3000/matematico?numbers=4,6,8"
```

**Respuesta esperada:**
```json
{
  "numbers": ["4", "6", "8"],
  "lcm": 24
}
```

### 2. Sumar 1 a un número

```bash
curl "http://localhost:3000/matematico?number=5"
```

**Respuesta esperada:**
```json
{
  "number": 5,
  "result": 6
}
```

## Endpoints de Consultas SQL

### Consulta 1: Todos los chistes de un usuario

Obtiene todos los chistes creados por un usuario específico usando el parámetro `user_name`.

```bash
# Chistes de Manolito
curl "http://localhost:3000/consultas?user_name=Manolito"

# Chistes de Pepe
curl "http://localhost:3000/consultas?user_name=Pepe"

# Chistes de Isabel
curl "http://localhost:3000/consultas?user_name=Isabel"

# Chistes de Pedro
curl "http://localhost:3000/consultas?user_name=Pedro"
```

**Respuesta esperada:**
```json
{
  "user": "Manolito",
  "count": 9,
  "jokes": [
    {
      "id": 1,
      "text": "¿Por qué los fantasmas no mienten? Porque se les ve la cara.",
      "created_at": "2024-01-01 12:00:00",
      "user_name": "Manolito",
      "theme_name": "humor negro"
    }
    // ... más chistes
  ]
}
```

### Consulta 2: Todos los chistes de una temática

Obtiene todos los chistes de una temática específica usando el parámetro `theme_name`.

```bash
# Chistes de humor negro
curl "http://localhost:3000/consultas?theme_name=humor negro"

# Chistes de humor amarillo
curl "http://localhost:3000/consultas?theme_name=humor amarillo"

# Chistes verdes
curl "http://localhost:3000/consultas?theme_name=chistes verdes"
```

**Nota:** Los espacios en los nombres de temáticas se manejan automáticamente. Usa comillas en la URL o codifica los espacios como `%20`:
```bash
curl "http://localhost:3000/consultas?theme_name=humor%20negro"
```

**Respuesta esperada:**
```json
{
  "theme": "humor negro",
  "count": 12,
  "jokes": [
    {
      "id": 1,
      "text": "¿Por qué los fantasmas no mienten? Porque se les ve la cara.",
      "created_at": "2024-01-01 12:00:00",
      "user_name": "Manolito",
      "theme_name": "humor negro"
    }
    // ... más chistes de todos los usuarios
  ]
}
```

### Consulta 3: Chistes de un usuario con una temática específica

Obtiene todos los chistes de un usuario específico con una temática específica usando ambos parámetros.

```bash
# Chistes de Manolito con temática humor negro
curl "http://localhost:3000/consultas?user_name=Manolito&theme_name=humor negro"

# Chistes de Pepe con temática humor amarillo
curl "http://localhost:3000/consultas?user_name=Pepe&theme_name=humor amarillo"

# Chistes de Isabel con temática chistes verdes
curl "http://localhost:3000/consultas?user_name=Isabel&theme_name=chistes verdes"
```

**Respuesta esperada:**
```json
{
  "user": "Manolito",
  "theme": "humor negro",
  "count": 3,
  "jokes": [
    {
      "id": 1,
      "text": "¿Por qué los fantasmas no mienten? Porque se les ve la cara.",
      "created_at": "2024-01-01 12:00:00",
      "user_name": "Manolito",
      "theme_name": "humor negro"
    }
    // ... 2 más
  ]
}
```

### Rutas Legacy (Compatibilidad)

Las siguientes rutas siguen funcionando pero están deprecadas:

```bash
# Deprecated: Usa /consultas?user_name=Manolito
curl http://localhost:3000/consultas/manolito

# Deprecated: Usa /consultas?theme_name=humor negro
curl http://localhost:3000/consultas/humor-negro

# Deprecated: Usa /consultas?user_name=Manolito&theme_name=humor negro
curl http://localhost:3000/consultas/manolito/humor-negro
```

## Endpoints de Usuarios

### 1. Obtener todos los usuarios

```bash
curl http://localhost:3000/usuarios
```

**Respuesta esperada:**
```json
{
  "count": 4,
  "users": [
    { "id": 1, "name": "Manolito" },
    { "id": 2, "name": "Pepe" },
    { "id": 3, "name": "Isabel" },
    { "id": 4, "name": "Pedro" }
  ]
}
```

### 2. Crear un usuario

```bash
curl -X POST http://localhost:3000/usuarios \
  -H "Content-Type: application/json" \
  -d '{"name": "NuevoUsuario"}'
```

**Respuesta esperada (nuevo usuario):**
```json
{
  "id": 5,
  "name": "NuevoUsuario",
  "created": true
}
```

**Respuesta esperada (usuario existente):**
```json
{
  "id": 1,
  "name": "NuevoUsuario",
  "created": false
}
```

## Endpoints de Temáticas

### 1. Obtener todas las temáticas

```bash
curl http://localhost:3000/tematicas
```

**Respuesta esperada:**
```json
{
  "count": 3,
  "themes": [
    { "id": 1, "name": "humor negro" },
    { "id": 2, "name": "humor amarillo" },
    { "id": 3, "name": "chistes verdes" }
  ]
}
```

### 2. Crear una temática

```bash
curl -X POST http://localhost:3000/tematicas \
  -H "Content-Type: application/json" \
  -d '{"name": "nueva tematica"}'
```

**Respuesta esperada (nueva temática):**
```json
{
  "id": 4,
  "name": "nueva tematica",
  "created": true
}
```

**Respuesta esperada (temática existente):**
```json
{
  "id": 1,
  "name": "nueva tematica",
  "created": false
}
```

**Nota:** Las temáticas tienen comportamiento upsert: si no existen se crean, si existen se devuelven.

## Health Check

### Verificar estado del servidor

```bash
curl http://localhost:3000/health
```

**Respuesta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Ejemplos con Postman

1. **Importar colección**: Puedes crear una colección en Postman con todos estos endpoints
2. **Variables de entorno**: Configura una variable `base_url` con valor `http://localhost:3000`
3. **Headers**: Para POST y PUT, asegúrate de incluir `Content-Type: application/json`

## Ejemplos con JavaScript (fetch)

```javascript
// Obtener chiste aleatorio
fetch('http://localhost:3000/chistes')
  .then(res => res.json())
  .then(data => console.log(data));

// Guardar chiste
fetch('http://localhost:3000/chistes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'Mi chiste favorito' })
})
  .then(res => res.json())
  .then(data => console.log(data));

// Calcular MCM
fetch('http://localhost:3000/matematico?numbers=4,6,8')
  .then(res => res.json())
  .then(data => console.log(data));
```

## Manejo de Errores

### Error 400 - Solicitud inválida

```bash
# Intentar obtener chiste con fuente inválida
curl http://localhost:3000/chistes/Invalid
```

**Respuesta:**
```json
{
  "error": "Invalid source: Invalid. Must be 'Chuck' or 'Dad'"
}
```

### Error 404 - Recurso no encontrado

```bash
# Intentar eliminar chiste que no existe
curl -X DELETE http://localhost:3000/chistes/999
```

**Respuesta:**
```json
{
  "error": "Joke with ID 999 not found"
}
```
