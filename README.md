# Plataforma de Salud Mental Estudiantil (DAE)

Sistema web integral desarrollado en **React** y **Tailwind CSS** para la gestión, acompañamiento y orientación en salud mental de la comunidad universitaria. Permite a estudiantes solicitar apoyo y agendar citas, y al equipo DAE (Dirección de Asuntos Estudiantiles) clasificar requerimientos, dar seguimiento a casos, gestionar talleres psicoeducativos y registrar bitácoras operativas.

---

## 🚀 Requisitos Previos

- **Node.js**: Versión 18.x o superior recomendada.
- **npm**: Versión 9.x o superior.

---

## 🛠️ Instalación y Ejecución

El repositorio tiene dos proyectos separados:

```
student_mental_healthcare/
├── frontend/      # React + Vite + Tailwind
├── backend/       # Node + Express + Mongoose (API REST)
└── compose.yaml   # Contenedor de MongoDB (Podman)
```

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/VicDario/student_mental_healthcare.git
   cd student_mental_healthcare
   ```

2. **Levantar MongoDB** (requiere Podman):
   ```bash
   podman compose up -d
   ```

3. **Backend** (http://localhost:3000):
   ```bash
   cd backend
   cp .env.example .env
   npm install
   npm run seed   # crea colecciones, índices y usuarios de prueba (contraseña: 123456)
   npm run dev
   ```
   Antes de `npm run dev`, completa en `.env` los valores de `JWT_SECRET` y `ENCRYPTION_KEY` (ver [Cifrado de datos sensibles](#cifrado-de-datos-sensibles)).

   Estilo y lint con [Biome](https://biomejs.dev): `npm run check` (corrige formato e imports), `npm run lint`, `npm run format`.

   Usuarios de prueba: `estudiante@test.cl`, `docente@test.cl`, `consejero@test.cl`, `profesional@test.cl`, `admin@test.cl`.

4. **Frontend** (http://localhost:5173):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Otros comandos: `npm run lint`, `npm run build`, `npm run preview`.

---

## 🔌 Backend

Estructura de `backend/src/`:

```
config/        # Conexión a MongoDB y constantes (perfiles, estados, tipos)
models/        # Modelos de Mongoose (10 colecciones)
routes/        # Rutas y perfiles permitidos en cada una
controllers/   # Reciben la petición y responden
services/      # Lógica de negocio y acceso a datos
middlewares/   # Autorización (JWT y perfiles), validación y manejo de errores
schemas/       # Esquemas de Zod para validar el body de cada endpoint
utils/         # JWT, cifrado y errores HTTP
app.js         # Configuración de Express
server.js      # Punto de entrada
seed.js        # Crea colecciones e índices y carga datos de prueba
```

Colecciones: `users`, `sessions`, `catalogs`, `supportRequests`, `followUps`, `appointments`, `notifications`, `workshops`, `enrollments`, `auditLogs`.

### Autenticación

| Método | Ruta | Acceso | Respuesta |
|--------|------|--------|-----------|
| `POST` | `/api/auth/register` | Público (crea estudiantes) | `201` con datos del usuario |
| `POST` | `/api/auth/login` | Público | `{ token, user }` |
| `POST` | `/api/auth/logout` | Cualquier usuario autenticado | `204` |
| `GET` | `/api/auth/me` | Cualquier usuario autenticado | Datos del usuario |

El token se envía en el header `Authorization: Bearer <token>` y contiene `id`, `role` y un `jti` que identifica la sesión en la colección `sessions`. Cada petición autenticada renueva la sesión; tras 30 minutos sin actividad, o después del logout, el token deja de servir. Variables necesarias en `.env`: `JWT_SECRET` y `JWT_EXPIRES_IN` (por defecto `2h`).

Para proteger una ruta se usa `requireAuth` (exige sesión válida) y, si solo algunos perfiles pueden entrar, `allowRoles` con esos perfiles. `requireAuth` deja `req.user = { id, role }` disponible para el controlador y el servicio, y `req.tokenId` con el id de la sesión (lo usa el logout):

```js
router.get('/', requireAuth, allowRoles('admin', 'counselor'), listUsers)
```

### Cifrado de datos sensibles

`supportRequests.description` y `followUps.text` se guardan cifrados con AES-256-GCM (`utils/crypto.js`). Si alguien accede directamente a MongoDB solo ve texto ilegible, y sin la clave correcta los datos no se pueden leer.

La clave va en `ENCRYPTION_KEY` (64 caracteres hex). Para generarla:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

El servidor no arranca si falta o no tiene el formato correcto. Quienes compartan una misma base de datos deben usar la misma clave.

El modelo cifra al asignar el campo y lo descifra al leerlo, así que los servicios trabajan con texto plano y `res.json()` lo devuelve descifrado. Consideraciones:

- Quién puede ver estos campos lo decide la ruta con `authorize` y el servicio al elegir qué devolver.
- Con `.lean()` no se descifra: se recibe el texto cifrado.
- No se puede buscar ni filtrar por estos campos.
- Si se cambia o pierde la clave, los datos guardados con la anterior quedan ilegibles.

### Validación

El body se valida con [Zod](https://zod.dev) usando el middleware `validate`, pasando el esquema del endpoint solo donde haga falta. Si los datos no son válidos responde `400` con el mensaje del primer error. Si son válidos, `req.body` queda con los datos limpios (por ejemplo, el correo en minúsculas) y sin los campos que no están en el esquema, así el servicio no repite validaciones:

```js
// schemas/auth.schemas.js
export const registerSchema = z.object({
  name: z.string({ error: 'El nombre es obligatorio' }).trim().min(1, 'El nombre es obligatorio'),
  email: email.pipe(z.email('El correo no es válido')),
  // ...
})

// routes/auth.routes.js
router.post('/register', validate(registerSchema), register)
```

Los endpoints de las demás funcionalidades se implementan según los issues del repositorio (#12 a #28).

---

## 📁 Estructura del Frontend

El código está estructurado bajo una arquitectura modular de componentes, separando responsabilidades entre primitivas de diseño, componentes de dominio, vistas y modelos de datos:

```
frontend/src/
├── assets/                 # Recursos gráficos institucionales (logos, fotografías, banners)
├── components/
│   ├── layout/             # Componentes estructurales globales (Navbar, Footer, DashboardPage)
│   ├── ui/                 # Sistema de componentes reutilizables (Panel, Button, Badge, StatsRow, Divider, PrivacyNote)
│   │   └── form/           # Primitivas de formulario (FormField, Input, Select, Textarea)
│   ├── home/               # Secciones de la página de inicio pública (Hero, Servicios, Orientación, CTA)
│   ├── talleres/           # Gestión de talleres (Tabla con filtros, Formulario de registro, Modal de nómina)
│   ├── citas/              # Agendamiento de citas (Ficha profesional, Selector de bloques, Resumen reactivo, Modal)
│   ├── clasificacion/      # Clasificación y derivación de requerimientos estudiantiles
│   ├── seguimiento/        # Ficha clínica y línea de tiempo de casos activos
│   ├── solicitud/          # Formulario de ingreso de solicitud de apoyo
│   └── reportes/           # Gráficos y reportes estadísticos de atención
├── data/                   # Catálogos maestros y datos iniciales mockeados (casos, talleres, citas, solicitudes)
├── layouts/                # Envoltorios de diseño generales (MainLayout)
├── pages/                  # Vistas principales enrutadas por React Router
├── App.jsx                 # Configuración central de rutas y navegación de la aplicación
├── main.jsx                # Punto de entrada de la aplicación React
└── index.css               # Estilos globales y directivas de Tailwind CSS
```

---

## 🖥️ Vistas y Módulos Implementados

| Módulo / Pantalla | Ruta | Descripción |
|---|---|---|
| **Portal de Inicio** | `/` | Portada institucional con secciones informativas, canales de apoyo SOS, testimonios y accesos rápidos. |
| **Solicitud de Apoyo** | `/solicitar-atencion` | Formulario estudiantil para solicitar contención, derivación o acompañamiento psicológico. |
| **Clasificación de Solicitudes** | `/clasificacion` | Consola para que profesionales clasifiquen requerimientos por urgencia, tipo y sede. |
| **Seguimiento de Casos** | `/seguimiento` | Panel clínico para registrar intervenciones, notas de avance y formalizar el cierre de casos. |
| **Agendamiento de Citas** | `/agendar-cita` | Selector interactivo de días y horarios con profesional asignado, resumen dinámico y comprobante con folio. |
| **Gestión de Talleres** | `/gestionar-talleres` | Tablero de control de talleres grupales con búsqueda en tiempo real, control de cupos y descarga de nóminas. |
| **Bitácora Institucional** | `/bitacora` | Registro de auditoría con trazabilidad de eventos y acciones administrativas del sistema. |
| **Administración de Usuarios** | `/admin-usuarios` | Gestión de cuentas institucionales y permisos para el equipo DAE. |
| **Reportes y Métricas** | `/reportes` | Tablero estadístico de atenciones mensuales y distribución por tipo de consulta. |

---

## 🎨 Arquitectura y Decisiones de Diseño

- **Componentización y Reutilización**: Se implementó una biblioteca compartida de componentes UI (`Panel`, `StatsRow`, `Button`, `Badge`, `Divider`, `PrivacyNote`, `FormField`, etc.) que garantiza consistencia visual y reduce la duplicación de código en todo el proyecto.
- **Gestión de Estado e Interactividad**: Uso riguroso de hooks de React (`useState`, `useMemo`) para filtros en vivo, cálculo dinámico de capacidades, selección de bloques horarios y validaciones de formulario.
- **Diseño Responsivo**: Maquetación mobile-first mediante Tailwind CSS con puntos de quiebre adaptables (`sm`, `md`, `lg`) que aseguran una visualización óptima en celulares, tablets y pantallas de escritorio sin desbordamientos.
- **Calidad de Código**: Configuración estricta de ESLint sin advertencias ni errores en el árbol de código fuente.
