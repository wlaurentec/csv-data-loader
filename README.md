# csv-data-loader
API REST Sistema de Carga y Validación de Datos con Autenticación

# Reto Técnico (Back-End Developer)

---

# Sistema de Carga y Validación de Datos con Autenticación

## Objetivo

Desarrollar una aplicación Back-End segura y robusta que permita a los usuarios autenticados, específicamente con rol de `admin`, cargar archivos CSV para la creación de registros en una base de datos PostgreSQL. La aplicación debe validar los datos del archivo CSV, permitir la corrección de registros inválidos y asegurar que solo usuarios autorizados realicen la carga de datos.

## Tecnologías Específicas

- **Backend**: Express para manejar la lógica del servidor.
- **Base de Datos**: PostgreSQL para almacenamiento de datos.
- **Autenticación/Autorización**: Uso de JWT para manejar sesiones de usuario y control de acceso.
- **Testing:** Vitest

## Backend (Express + PostgreSQL)

### Endpoints

- **Autenticación**: Endpoint `/login` para autenticación de usuarios, que verifica credenciales (email y password) y retorna un token JWT.
- **Carga de Datos**: Endpoint `/upload` protegido con middleware de autorización, para la carga y procesamiento de archivos CSV.

### Middleware de Autorización

- Verificar el JWT en cada solicitud al endpoint `/upload`, asegurando que solo usuarios con rol de `admin` puedan acceder.
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

    Puedes modificar a tu criterio los mensajes de error para cada campo.

### Modelo de Datos

- Crear una tabla `users` con los campos:
    - `id`: Identificador único del usuario (clave primaria, autoincremental).
    - `name`: Nombre del usuario (string, obligatorio).
    - `email`: Email del usuario (string, único, obligatorio y debe seguir un formato válido de correo electrónico).
    - `age`: Edad del usuario (integer, opcional, si se proporciona, debe ser un número entero mayor que 0).
    - `role`: Rol del usuario, puede ser `user` o `admin`. Por defecto es `user`.

## Testing

Deberás implementar al menos cinco pruebas en el Backend. Una mayor cobertura de tests será un plus.

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

