# Sistema de Carga y Validación de Datos con Autenticación

## Descripción

Aplicación Back-End segura y robusta que permite a los usuarios autenticados, específicamente con rol de `admin`, la cargade  archivos CSV para la creación de registros en una base de datos PostgreSQL. La aplicación valida los datos del archivo CSV, permite la corrección de registros inválidos y asegurar que solo usuarios autorizados realicen la carga de datos.

## Tecnologías Específicas

- **Backend**: Express maneja la lógica del servidor.
- **Base de Datos**: PostgreSQL para almacenamiento de datos.
- **Autenticación/Autorización**: JWT para manejar sesiones de usuario y control de acceso.
- **Testing:** Vitest y Supertest

## Backend (Express + PostgreSQL)

### Endpoints

- **Autenticación**: Endpoint `/login` para autenticación de usuarios, que verifica credenciales (email y password) y retorna un token JWT.
- **Carga de Datos**: Endpoint `/upload` protegido con middleware de autorización, para la carga y procesamiento de archivos CSV.

### Middleware de Autorización

- Verifica el JWT en cada solicitud al endpoint `/upload`, asegurando que solo usuarios con rol de `admin` puedan acceder.
- Un usuario con rol `admin` deberá ser pre-creado en la base de datos (seed).

### Procesamiento de Archivos CSV

- Recibir archivo CSV en endpoint `/upload`.
- Leer y validar el contenido del archivo CSV (name, email, age) y por cada fila crear un registro en la tabla `users`.
- Generar una respuesta detallada con los registros exitosos y un informe de errores específicos por registro y campo:

    ```json
    {
        "ok": true,
        "data": {
            "success": [
                {
                    "id": 1,
                    "name": "Juan Perez",
                    "email": "juan.perez@example.com",
                    "age": 28
                }
                // Otros registros exitosos...
            ],
            "errors": [
                {
                    "row": 4,
                    "details": {
                        "name": "El campo 'name' no puede estar vacío.",
                        "email": "El formato del campo 'email' es inválido.",
                        "age": "El campo 'age' debe ser un número positivo."
                    }
                }
                // Otros registros con errores...
            ]
        }
    }
    ```

### Modelo de Datos

- La tabla `users` se creo con los campos:
    - `id`: Identificador único del usuario (clave primaria, autoincremental).
    - `name`: Nombre del usuario (string, obligatorio).
    - `email`: Email del usuario (string, único, obligatorio y con un formato válido de correo electrónico).
    - `age`: Edad del usuario (integer, opcional, si se proporciona, debe ser un número entero mayor que 0).
    - `role`: Rol del usuario, puede ser `user` o `admin`. Por defecto es `user`.


## Manual de Uso de la API

### 1. Autenticación

#### Endpoint: `/login`

**Método**: POST

**Descripción**: Autentica a un usuario verificando sus credenciales (email y password) y retorna un token JWT.

**Request**:

```json
{
    "email": "admin@example.com",
    "password": "adminpassword"
}
```

## Instalación

1. Clona este repositorio: `git clone git@github.com:wlaurentec/csv-data-loader.git`
2. Instala las dependencias: `npm install`

## Configuración

1. Modifica el archivo `.env.example` en la raíz del proyecto con tus variables de entorno:

PGHOST=localhost
PGDATABASE=tu-base-datos
PGPORT=5432
PGUSER=[usuario]
PGPASSWORD=[password]
PGADMINDATABASE=[admin-database]
PORT=3000
CLIENT_ORIGIN=*


2. Ejecuta el script: `npm run db:createAdmin` para cargar en la base de datos admin, que por defecto es:

```json
{
    "email": "lechuga@gmail.com",
    "password": "1234"
}
```
Puedes ingresar tus datos de Admin en: scripts/dbCreateAdmin.ts
## Uso

1. Inicia el servidor: `npm run dev`
2. Accede a la API en `http://localhost:3000`

## Endpoints

- `POST /login`: Inicio de sesión. Requiere un cuerpo JSON con `email` y `password`.
- `POST /upload`: Carga de archivo CSV. Requiere autenticación como usuario administrador.
- Adicionalmente se tienen los siguientes endpoints: `POST /signup`, `POST /logout` y `GET /users`.

## Pruebas

1. Ejecuta las pruebas con: `npm run test`

## Contribución

¡Contribuciones son bienvenidas! Si quieres contribuir a este proyecto, sigue estos pasos:

1. Haz un fork del repositorio
2. Crea una nueva rama: `git checkout -b mi-contribucion`
3. Realiza tus cambios y haz commit: `git commit -am 'Añade mi contribución'`
4. Haz push a la rama: `git push origin mi-contribucion`
5. Crea un pull request en GitHub

## Licencia

Este proyecto está bajo la Licencia MIT. Para más detalles, ver el archivo LICENSE.