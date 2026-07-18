# Global English — Backend

API REST del sistema de gestión del instituto de inglés **Global English**. Administra alumnos, profesores, cursos, inscripciones, pagos, asistencias y reportes.

> **Frontend del proyecto:** https://github.com/JuanCruz44/global-english-frontend

## Tecnologías

- **Node.js** + **Express 5** (servidor y API REST)
- **Sequelize 6** (ORM) + **MySQL**
- **JWT** (autenticación por token) + **bcryptjs** (encriptado de contraseñas)
- **dotenv** (variables de entorno) · **CORS**

## Requisitos

- Node.js LTS (18 o superior)
- MySQL 8+ (o XAMPP)
- Git

## Instalación

```bash
git clone https://github.com/JuanCruz44/global-english-backend.git
cd global-english-backend
npm install
```

1. Crear el archivo `.env` (ver más abajo).
2. Crear la base de datos e importar el respaldo (ver **Base de datos**).
3. Iniciar el servidor:

```bash
node src/index.js
```

El backend queda corriendo en `http://localhost:3000`.

## Variables de entorno (`.env`)

El archivo `.env` **no se sube al repositorio** (está en `.gitignore`) porque contiene datos sensibles. Crealo en la raíz con este formato:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_de_mysql
DB_NAME=global_english
DB_PORT=3306
PORT=3000
JWT_SECRET=un_texto_largo_y_secreto
```

## Base de datos

El respaldo con datos de prueba está en `database/global_english.sql`.

```bash
# 1. Crear la base
CREATE DATABASE global_english;

# 2. Importar el respaldo
mysql -u root -p global_english < database/global_english.sql
```

## Usuarios iniciales

- **`secretaria`** — acceso completo al sistema.
- **Profesores** (por ejemplo `laura`, `carlos`) — acceso solo a asistencias.

Las contraseñas se guardan **encriptadas con bcrypt**. La contraseña inicial de prueba es `1234` (se recomienda cambiarla en producción).

## Estructura del proyecto

```
src/
├── config/database.js     Conexión a MySQL (Sequelize)
├── models/                Modelos de datos (Alumno, Curso, Profesor, Pago, ...)
├── routes/                Rutas de la API (auth, alumnos, pagos, asistencias, ...)
├── middleware/auth.js     Verificación de token y control de roles
├── utils/                 Cálculo de morosidad y estadísticas de asistencia
└── index.js               Punto de entrada del servidor
resetear-password.js       Script de administración para restablecer contraseñas
```

## Scripts útiles

```bash
node resetear-password.js <usuario> <nueva_contraseña>   # restablecer una contraseña
```

## Respaldo de la base de datos

```bash
mysqldump -u root -p global_english > database/global_english.sql
```

---

Proyecto desarrollado para la **Práctica Profesionalizante II — 2026**.
