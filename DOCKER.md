# Guía de Docker

Esta guía proporciona instrucciones detalladas para usar Docker con la aplicación SquadMakers Jokes API.

## Requisitos Previos

- Docker Desktop instalado (versión 20.10 o superior)
- Docker Compose instalado (versión 2.0 o superior)

Verifica la instalación:
```bash
docker --version
docker-compose --version
```

## Inicio Rápido

1. **Construir y ejecutar el contenedor:**
```bash
docker-compose up -d
```

2. **Verificar que el contenedor está corriendo:**
```bash
docker-compose ps
```

3. **Probar el endpoint de health:**
```bash
curl http://localhost:3000/health
```

¡Listo! La API está disponible en `http://localhost:3000`

## Comandos Útiles

### Gestión del Contenedor

```bash
# Iniciar el contenedor en segundo plano
docker-compose up -d

# Iniciar el contenedor y ver logs
docker-compose up

# Detener el contenedor
docker-compose down

# Detener y eliminar volúmenes (incluye la base de datos)
docker-compose down -v

# Reiniciar el contenedor
docker-compose restart

# Ver el estado del contenedor
docker-compose ps
```

### Logs

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Ver últimos 100 líneas de logs
docker-compose logs --tail=100

# Ver logs solo del servicio api
docker-compose logs -f api
```

### Construcción

```bash
# Reconstruir la imagen sin caché
docker-compose build --no-cache

# Reconstruir y reiniciar
docker-compose up -d --build

# Ver imágenes construidas
docker images | grep squadmakers
```

### Ejecutar Comandos Dentro del Contenedor

```bash
# Abrir una shell en el contenedor
docker-compose exec api sh

# Ejecutar un comando específico
docker-compose exec api node -v

# Ver el contenido de la base de datos
docker-compose exec api ls -la /app/database
```

## Persistencia de Datos

La base de datos SQLite se guarda en el directorio `./database` del proyecto mediante un volumen de Docker. Esto significa que:

- ✅ Los datos persisten aunque detengas el contenedor
- ✅ Los datos persisten aunque reconstruyas la imagen
- ✅ Puedes acceder a la base de datos desde el host

### Reiniciar con Base de Datos Limpia

Si necesitas empezar con una base de datos limpia:

```bash
# Detener el contenedor
docker-compose down

# Eliminar el archivo de base de datos
rm database/jokes.db

# Reiniciar el contenedor (se creará una nueva base de datos)
docker-compose up -d
```

## Variables de Entorno

Puedes modificar las variables de entorno editando el archivo `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=production
  - PORT=3000
  - DB_PATH=/app/database/jokes.db
```

O crear un archivo `.env` y referenciarlo en `docker-compose.yml`:

```yaml
env_file:
  - .env
```

## Health Check

El contenedor incluye un health check que verifica el estado de la API cada 30 segundos. Puedes ver el estado con:

```bash
docker-compose ps
```

El estado aparecerá como `healthy` cuando la API esté funcionando correctamente.

## Solución de Problemas

### El contenedor no inicia

1. Verifica los logs:
```bash
docker-compose logs
```

2. Verifica que el puerto 3000 no esté en uso:
```bash
lsof -i :3000
# En Windows: netstat -ano | findstr :3000
```

3. Reconstruye la imagen:
```bash
docker-compose build --no-cache
docker-compose up -d
```

### Error al construir la imagen

Si encuentras errores relacionados con módulos nativos (como sqlite3):

```bash
# Limpia el caché de Docker
docker system prune -a

# Reconstruye sin caché
docker-compose build --no-cache
```

### La base de datos no persiste

Verifica que el volumen esté montado correctamente:

```bash
docker-compose exec api ls -la /app/database
```

Deberías ver el archivo `jokes.db` si la base de datos se ha creado.

### Ver logs de la aplicación

Los logs se guardan en dos lugares:
- En el contenedor: `/app/logs/`
- En el host: `./logs/` (si el volumen está configurado)

```bash
# Ver logs desde el contenedor
docker-compose exec api cat /app/logs/combined.log

# Ver logs desde el host
cat logs/combined.log
```

## Desarrollo con Docker

Si quieres desarrollar usando Docker pero con hot-reload:

1. Modifica `docker-compose.yml` para montar el código como volumen:
```yaml
volumes:
  - ./src:/app/src
  - ./database:/app/database
  - ./logs:/app/logs
  - /app/node_modules  # Evita sobrescribir node_modules
```

2. Usa nodemon en lugar de node:
```yaml
command: npm run dev
```

3. Reconstruye y reinicia:
```bash
docker-compose up -d --build
```

## Producción

Para producción, considera:

1. **Usar variables de entorno seguras**: No hardcodees secretos
2. **Configurar límites de recursos**:
```yaml
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
```
3. **Usar un reverse proxy** (nginx, traefik) delante del contenedor
4. **Configurar backups** de la base de datos
5. **Monitoreo**: Integrar con herramientas de monitoreo

## Limpieza

Para limpiar completamente Docker:

```bash
# Detener y eliminar contenedores
docker-compose down -v

# Eliminar la imagen
docker rmi squadmakers-api

# Limpiar sistema Docker (cuidado: elimina todo lo no usado)
docker system prune -a
```
