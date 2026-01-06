# SquadMakers Jokes API

API REST desarrollada con Express.js para gestionar chistes y realizar operaciones matemáticas.

## 📋 Características

- **Endpoints de Chistes**: Obtener, crear, actualizar y eliminar chistes
- **Integración con APIs externas**: Chuck Norris API y Dad Jokes API
- **Endpoints Matemáticos**: Cálculo de MCM (Mínimo Común Múltiplo) y suma de números
- **Base de datos SQLite**: Almacenamiento de chistes con usuarios y temáticas
- **Chistes Emparejados**: Endpoint que combina chistes de ambas APIs externas
- **Documentación OpenAPI**: Especificación completa en formato YAML

## 🚀 Instalación

### Opción 1: Docker (Recomendado)

#### Requisitos previos
- Docker (versión 20.10 o superior)
- Docker Compose (versión 2.0 o superior)

#### Pasos de instalación con Docker

1. Clona el repositorio:
```bash
git clone https://github.com/cvelazqueze/squadmakers-tst
cd squadmakers
```

2. Construye y ejecuta el contenedor:
```bash
docker-compose up -d
```

El servidor estará disponible en `http://localhost:3000`

#### Comandos útiles de Docker

```bash
# Ver logs del contenedor
docker-compose logs -f

# Detener el contenedor
docker-compose down

# Detener y eliminar volúmenes (incluye la base de datos)
docker-compose down -v

# Reconstruir la imagen
docker-compose build

# Reiniciar el contenedor
docker-compose restart

# Ver el estado del contenedor
docker-compose ps
```

> 📖 Para más detalles sobre Docker, consulta la [Guía de Docker](DOCKER.md)

#### Persistencia de datos

La base de datos se guarda en el directorio `./database` del proyecto, por lo que los datos persisten incluso si detienes el contenedor. Si quieres empezar con una base de datos limpia, elimina el archivo `database/jokes.db` y reinicia el contenedor.

### Opción 2: Instalación Local

#### Requisitos previos

- Node.js (versión 14 o superior)
- npm o yarn

#### Pasos de instalación

1. Clona el repositorio:
```bash
git clone https://github.com/cvelazqueze/squadmakers-tst
```

2. Instala las dependencias:
```bash
npm install
```

3. (Opcional) Configura variables de entorno:
```bash
cp .env.example .env
```

Edita el archivo `.env` si necesitas cambiar la configuración por defecto:
```
PORT=3000
DB_PATH=./database/jokes.db
NODE_ENV=development
```

## 🏃 Ejecución

### Con Docker

Si usas Docker, el servidor ya está corriendo después de ejecutar `docker-compose up -d`. Puedes verificar el estado con:

```bash
curl http://localhost:3000/health
```

### Sin Docker (Instalación Local)

#### Modo desarrollo (con nodemon)
```bash
npm run dev
```

#### Modo producción
```bash
npm start
```

El servidor se iniciará en `http://localhost:3000` por defecto.

## 📚 Endpoints

### Chistes

#### GET /chistes
Obtiene un chiste aleatorio (de Chuck Norris o Dad Jokes).

**Ejemplo:**
```bash
curl http://localhost:3000/chistes
```

#### GET /chistes/:source
Obtiene un chiste de una fuente específica (`Chuck` o `Dad`).

**Ejemplos:**
```bash
curl http://localhost:3000/chistes/Chuck
curl http://localhost:3000/chistes/Dad
```

#### POST /chistes
Guarda un chiste en la base de datos. Requiere `text`, `usuario` y `tematica`. La temática se creará automáticamente si no existe (upsert).

**Ejemplo:**
```bash
curl -X POST http://localhost:3000/chistes \
  -H "Content-Type: application/json" \
  -d '{
    "text": "¿Por qué el pollo cruzó la calle? Para llegar al otro lado.",
    "usuario": "Manolito",
    "tematica": "humor amarillo"
  }'
```

**Respuesta:**
```json
{
  "id": 37,
  "text": "¿Por qué el pollo cruzó la calle? Para llegar al otro lado.",
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

#### PUT /chistes/:number
Actualiza un chiste existente.

**Ejemplo:**
```bash
curl -X PUT http://localhost:3000/chistes/1 \
  -H "Content-Type: application/json" \
  -d '{"text": "Chiste actualizado"}'
```

#### DELETE /chistes/:number
Elimina un chiste.

**Ejemplo:**
```bash
curl -X DELETE http://localhost:3000/chistes/1
```

#### GET /chistes/emparejados
Obtiene 5 chistes emparejados (5 de Chuck Norris y 5 de Dad Jokes combinados).

**Ejemplo:**
```bash
curl http://localhost:3000/chistes/emparejados
```

**Respuesta:**
```json
[
  {
    "chuck": "Chuck Norris counted to infinity. Twice.",
    "dad": "Why did the math book look sad? Because it had too many problems.",
    "combinado": "Chuck Norris counted to infinity. Twice. Also, why did the math book look sad? because it had too many problems."
  }
]
```

### Matemáticas

#### GET /matematico?numbers=4,6,8
Calcula el Mínimo Común Múltiplo (MCM) de una lista de números.

**Ejemplo:**
```bash
curl http://localhost:3000/matematico?numbers=4,6,8
```

**Respuesta:**
```json
{
  "numbers": ["4", "6", "8"],
  "lcm": 24
}
```

#### GET /matematico?number=5
Suma 1 a un número.

**Ejemplo:**
```bash
curl http://localhost:3000/matematico?number=5
```

**Respuesta:**
```json
{
  "number": 5,
  "result": 6
}
```

### Consultas SQL

#### GET /consultas/manolito
Obtiene todos los chistes creados por el usuario "Manolito".

**Ejemplo:**
```bash
curl http://localhost:3000/consultas/manolito
```

#### GET /consultas/humor-negro
Obtiene todos los chistes de la temática "humor negro".

**Ejemplo:**
```bash
curl http://localhost:3000/consultas/humor-negro
```

#### GET /consultas/manolito/humor-negro
Obtiene todos los chistes de "Manolito" con temática "humor negro".

**Ejemplo:**
```bash
curl http://localhost:3000/consultas/manolito/humor-negro
```

### Usuarios

#### GET /usuarios
Obtiene todos los usuarios registrados.

**Ejemplo:**
```bash
curl http://localhost:3000/usuarios
```

**Respuesta:**
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

#### POST /usuarios
Crea un nuevo usuario. Si el usuario ya existe, devuelve el usuario existente.

**Ejemplo:**
```bash
curl -X POST http://localhost:3000/usuarios \
  -H "Content-Type: application/json" \
  -d '{"name": "Manolito"}'
```

**Respuesta (nuevo usuario):**
```json
{
  "id": 5,
  "name": "Manolito",
  "created": true
}
```

**Respuesta (usuario existente):**
```json
{
  "id": 1,
  "name": "Manolito",
  "created": false
}
```

### Temáticas

#### GET /tematicas
Obtiene todas las temáticas registradas.

**Ejemplo:**
```bash
curl http://localhost:3000/tematicas
```

**Respuesta:**
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

#### POST /tematicas
Crea una nueva temática. Si la temática ya existe, devuelve la temática existente (upsert).

**Ejemplo:**
```bash
curl -X POST http://localhost:3000/tematicas \
  -H "Content-Type: application/json" \
  -d '{"name": "humor negro"}'
```

**Respuesta (nueva temática):**
```json
{
  "id": 4,
  "name": "humor negro",
  "created": true
}
```

**Respuesta (temática existente):**
```json
{
  "id": 1,
  "name": "humor negro",
  "created": false
}
```

### Health Check

#### GET /health
Verifica el estado del servidor.

**Ejemplo:**
```bash
curl http://localhost:3000/health
```

## 🧪 Pruebas

### Ejecutar todas las pruebas
```bash
npm test
```

### Ejecutar pruebas en modo watch
```bash
npm run test:watch
```

### Generar reporte de cobertura
```bash
npm run test:coverage
```

## 📊 Base de Datos

La aplicación utiliza **Sequelize ORM** con SQLite para almacenar los datos. La base de datos se crea automáticamente al iniciar el servidor.

### ORM: Sequelize

Sequelize es un ORM (Object-Relational Mapping) que proporciona:
- Modelos tipados y validación
- Asociaciones entre modelos
- Migraciones y sincronización automática
- Consultas más seguras y mantenibles

### Estructura

- **users**: Usuarios (Manolito, Pepe, Isabel, Pedro)
- **themes**: Temáticas (humor negro, humor amarillo, chistes verdes)
- **jokes**: Chistes con relación a usuarios y temáticas

### Modelos

Los modelos están definidos en `src/models/`:
- `User.js` - Modelo de usuario
- `Theme.js` - Modelo de temática
- `Joke.js` - Modelo de chiste

Las asociaciones están configuradas en `src/models/index.js`:
- User hasMany Jokes
- Theme hasMany Jokes
- Joke belongsTo User
- Joke belongsTo Theme

### Datos iniciales

Al iniciar el servidor por primera vez, se crean automáticamente:
- 4 usuarios: Manolito, Pepe, Isabel, Pedro
- 3 temáticas: humor negro, humor amarillo, chistes verdes
- 36 chistes: 3 chistes por temática por usuario

## 📖 Documentación API

La documentación completa de la API está disponible en formato OpenAPI/Swagger en el archivo `api-docs.yaml`.

Puedes visualizar la documentación usando herramientas como:
- [Swagger Editor](https://editor.swagger.io/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [Postman](https://www.postman.com/)

## 🏗️ Estructura del Proyecto

```
squadmakers/
├── src/
│   ├── config/
│   │   ├── database.js      # Configuración de base de datos
│   │   └── logger.js         # Configuración de logging
│   ├── models/
│   │   ├── index.js          # Configuración de Sequelize y asociaciones
│   │   ├── User.js           # Modelo de usuario
│   │   ├── Theme.js          # Modelo de temática
│   │   └── Joke.js           # Modelo de chiste
│   ├── controllers/
│   │   ├── jokeController.js # Controlador de chistes
│   │   ├── mathController.js # Controlador matemático
│   │   ├── queryController.js # Controlador de consultas
│   │   ├── userController.js # Controlador de usuarios
│   │   └── themeController.js # Controlador de temáticas
│   ├── routes/
│   │   ├── jokeRoutes.js     # Rutas de chistes
│   │   ├── mathRoutes.js     # Rutas matemáticas
│   │   ├── queryRoutes.js    # Rutas de consultas
│   │   ├── userRoutes.js     # Rutas de usuarios
│   │   └── themeRoutes.js    # Rutas de temáticas
│   ├── services/
│   │   ├── jokeService.js    # Servicio de APIs externas
│   │   ├── mathService.js    # Servicio matemático
│   │   └── dbService.js      # Servicio de base de datos (Sequelize)
│   ├── app.js                # Configuración de Express
│   └── index.js              # Punto de entrada
├── tests/
│   ├── services/             # Pruebas de servicios
│   └── controllers/          # Pruebas de controladores
├── database/                 # Base de datos SQLite
├── api-docs.yaml            # Documentación OpenAPI
├── Dockerfile               # Configuración de Docker
├── docker-compose.yml       # Configuración de Docker Compose
├── .dockerignore            # Archivos ignorados en Docker
├── jest.config.js           # Configuración de Jest
├── package.json
└── README.md
```

## 🔧 Tecnologías Utilizadas

- **Express.js**: Framework web para Node.js
- **Sequelize**: ORM para Node.js
- **SQLite3**: Base de datos SQL
- **Axios**: Cliente HTTP para consumir APIs externas
- **Winston**: Sistema de logging
- **Jest**: Framework de testing
- **Supertest**: Testing de APIs HTTP
- **Docker**: Contenedorización de la aplicación
- **Docker Compose**: Orquestación de contenedores

## 📝 Notas

- Los chistes guardados en la base de datos se asocian por defecto al usuario con ID 1 y temática con ID 1. En una aplicación real, estos valores deberían venir de la autenticación y parámetros de la petición.
- El endpoint de chistes emparejados realiza 10 peticiones HTTP en paralelo (5 a cada API externa).
- Los logs se guardan en archivos `error.log` y `combined.log` además de mostrarse en consola.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 👤 Autor

Cesar Velazquez

---

Para más información, consulta la documentación en `api-docs.yaml`.
