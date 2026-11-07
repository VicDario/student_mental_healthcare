# Documentación de la API

Base: `http://localhost:3000/api`. Todas las respuestas son JSON.

## Convenciones

**Sesión.** Salvo `register`, `login` y `/health`, todas las rutas exigen el header
`Authorization: Bearer <token>`. El token se obtiene con `POST /auth/login`. La sesión expira tras
**30 minutos sin actividad** o al cerrar sesión; desde ahí la API responde `401`.

**Perfiles.** `student` (estudiante), `teacher` (docente), `counselor` (consejero), `professional`
(profesional de apoyo) y `admin` (administrador de bienestar). Si el perfil no tiene permiso la API
responde `403`.

**Errores.** Todas las respuestas de error tienen el mismo formato:

```json
{
  "message": "El correo no es válido",
  "errors": [
    { "field": "email", "message": "El correo no es válido" },
    { "field": "password", "message": "La contraseña debe tener al menos 6 caracteres" }
  ]
}
```

| Código | Cuándo |
|---|---|
| `400` | Datos inválidos (con todos los campos en `errors`), identificador mal formado (`field: "id"`) o JSON mal escrito |
| `401` | Sin sesión, sesión expirada o credenciales incorrectas |
| `403` | El perfil no tiene permiso |
| `404` | No existe **o está fuera del alcance del usuario** (no se revela que existe) |
| `409` | Registro duplicado (correo, código de catálogo, inscripción repetida, taller sin cupos) |
| `500` | Error interno. Nunca incluye detalles técnicos |

**Fechas** en formato ISO 8601 (`2026-11-20T15:00:00.000Z`). **Ids** de MongoDB (24 caracteres hexadecimales).

---

## Autenticación

| Método | Ruta | Perfiles | Cuerpo | Respuesta |
|---|---|---|---|---|
| `POST` | `/auth/register` | Público | `name`, `email`, `password` (mín. 6), `studentCode?`, `program?`, `phone?` | `201` usuario creado como estudiante. `409` si el correo existe |
| `POST` | `/auth/login` | Público | `email`, `password` | `200 { token, user: { id, name, email, role } }`. `401` si no coincide |
| `POST` | `/auth/logout` | Autenticado | — | `204`. El token deja de servir |
| `GET` | `/auth/me` | Autenticado | — | `200 { id, name, email, role }` |

Cada ingreso, ingreso fallido y cierre de sesión queda en la bitácora.

## Usuarios (#24)

| Método | Ruta | Perfiles | Cuerpo / filtros | Respuesta |
|---|---|---|---|---|
| `GET` | `/users?role=&active=&search=` | admin, counselor | `active`: `true`/`false`; `search` busca en nombre y correo | Lista de cuentas |
| `POST` | `/users` | admin | `name`, `email`, `password`, `role`, `campus?`, `unit?`, `studentCode?`, `program?`, `phone?` | `201` cuenta. `409` correo repetido. `400` si la sede o unidad no existe o está inactiva |
| `PUT` | `/users/:id` | admin | Los mismos campos, todos opcionales (al menos uno) | Cuenta actualizada |
| `PATCH` | `/users/:id/deactivate` | admin | — | Cuenta inactiva y **todas sus sesiones cerradas**. `400` si es la propia cuenta |
| `PATCH` | `/users/:id/activate` | admin | — | Cuenta activa |

El administrador recibe `{ id, name, email, role, campus, unit, studentCode, program, phone, active, lastLoginAt, createdAt }`.
El **consejero** solo ve al equipo activo que atiende casos (`professional` y `counselor`) con `{ id, name, role, unit }`,
sin correos, para elegir a quién asignar. Si pide otro perfil recibe `403`.

## Catálogos (#24)

Tipos de catálogo: `support_type` (tipos de apoyo), `campus` (sedes) y `unit` (unidades de apoyo).

| Método | Ruta | Perfiles | Cuerpo / filtros | Respuesta |
|---|---|---|---|---|
| `GET` | `/catalogs?type=` | Autenticado | — | `[{ id, type, code, name, active }]`. Fuera del admin, solo los activos |
| `POST` | `/catalogs` | admin | `type`, `code` (minúsculas, números y `_`), `name` | `201`. `409` si el código ya existe en ese catálogo |
| `PUT` | `/catalogs/:id` | admin | `code?`, `name?`, `active?` | Elemento actualizado. Desactivar lo oculta de los formularios |

## Solicitudes de apoyo (#16, #17)

| Método | Ruta | Perfiles | Cuerpo / filtros | Respuesta |
|---|---|---|---|---|
| `POST` | `/requests` | student | `reason`, `description`, `perceivedUrgency` (`low`/`medium`/`high`), `contact: { channel: email\|phone, value }`, `campus?` | `201` solicitud `SOL-<año>-NNNN`, estado `received`. Aviso al estudiante |
| `POST` | `/requests/referral` | teacher | `studentEmail`, `course?`, `observedSituation`, `studentInformed` (boolean), `perceivedUrgency` | `201` solicitud con `origin: "referral"`. Aviso respetuoso al estudiante, sin la situación observada |
| `GET` | `/requests?status=` | Autenticado | `status`: `received`, `classified`, `assigned`, `in_progress`, `closed` | Resumen de las solicitudes a su alcance |
| `GET` | `/requests/:id` | Autenticado | — | Detalle (incluye la descripción descifrada). `404` si está fuera de su alcance. Si lo abre el equipo, queda `view` en la bitácora. En una derivación el estudiante recibe `description: null` (no ve la observación del docente). Si está cerrada, el equipo (no estudiante ni docente) recibe `closure` |

**Alcance por perfil:** el estudiante ve las suyas (también las derivadas por un docente), el docente solo las que derivó,
el profesional solo las asignadas a él, y consejero y administrador todas.

## Flujo de atención (#18 a #21)

| Método | Ruta | Perfiles | Cuerpo | Reglas y respuesta |
|---|---|---|---|---|
| `PATCH` | `/requests/:id/classify` | counselor | `type` (id de `support_type` activo), `priority` (`low`/`medium`/`high`) | Estado → `classified`. Se puede corregir mientras no esté asignada |
| `PATCH` | `/requests/:id/assign` | counselor, admin | `assignedTo` (id de un `professional` o `counselor` activo) | Primero debe estar clasificada. Estado → `assigned` (si ya está en atención, se reasigna sin cambiar el estado). Las citas agendadas pasan al nuevo profesional |
| `GET` | `/requests/:id/follow-ups` | professional, counselor, admin | — | Observaciones `[{ id, text, author, createdAt }]`. Estudiantes y docentes: `403`. Queda `view` en la bitácora |
| `POST` | `/requests/:id/follow-ups` | professional (asignado), counselor | `text` (máx. 5000) | `201`. Se guarda **cifrada**. La primera deja la solicitud en `in_progress` |
| `PATCH` | `/requests/:id/close` | professional (asignado), counselor | `reason`, `referralType` (`internal`/`external`/`none`), `referralDestination` (obligatorio si hay derivación) | Estado → `closed`, con `closure`. Las citas agendadas se cancelan |

En todos: el cambio queda en `statusHistory` y en la bitácora, y se notifica al estudiante. **Un caso cerrado no admite
cambios** (`400`).

## Citas (#20)

| Método | Ruta | Perfiles | Cuerpo / filtros | Respuesta |
|---|---|---|---|---|
| `POST` | `/appointments` | professional (asignado), counselor | `request`, `startsAt` (futuro), `modality` (`in_person`/`online`), `durationMinutes?` (15–180, por defecto 45), `location?` | `201` cita `scheduled`, a cargo del profesional asignado. Aviso al estudiante |
| `GET` | `/appointments?status=&request=` | student, professional, counselor, admin | — | El estudiante ve las suyas, el profesional las que atiende, consejero y admin todas. Docente: `403` |
| `PATCH` | `/appointments/:id/status` | professional (de la cita), counselor | `status`: `completed`, `cancelled` o `no_show` | Solo desde `scheduled` |

Las citas incluyen `{ id, request: { id, code }, student, professional, startsAt, durationMinutes, modality, location, status }`
y nunca el motivo ni las observaciones.

## Notificaciones (#22)

| Método | Ruta | Perfiles | Filtros | Respuesta |
|---|---|---|---|---|
| `GET` | `/notifications?unread=` | Autenticado | `unread=true` solo las no leídas | Las propias, de la más nueva a la más antigua |
| `PATCH` | `/notifications/:id/read` | Autenticado | — | Marca como leída. `404` si no es propia |

Se generan solas en: recepción (`received`), cambio de estado (`status_changed`), asignación (`assigned`) y cita
agendada (`appointment`). Solo incluyen el código de la solicitud, nunca datos sensibles.

## Talleres (#23)

| Método | Ruta | Perfiles | Cuerpo / filtros | Respuesta |
|---|---|---|---|---|
| `GET` | `/workshops?status=&kind=` | Autenticado | `status`: `scheduled`/`cancelled`/`finished`; `kind`: `workshop`/`talk`/`activity` | Lista por fecha, con `takenSeats` |
| `POST` | `/workshops` | admin, professional | `title`, `kind`, `modality` (`in_person`/`online`/`hybrid`), `startsAt`, `endsAt`, `capacity`, `description?`, `category?`, `location?`, `campus?`, `facilitator?` | `201` taller `scheduled` |
| `PUT` | `/workshops/:id` | admin, professional | Los mismos campos, opcionales | El cupo no puede quedar bajo los inscritos |
| `DELETE` | `/workshops/:id` | admin, professional | — | Estado `cancelled` (no se borra) |
| `POST` | `/workshops/:id/enrollments` | student | — | `201`. `409` si ya está inscrito o no quedan cupos |
| `DELETE` | `/workshops/:id/enrollments` | student | — | Inscripción `cancelled`, libera el cupo |
| `GET` | `/workshops/:id/enrollments` | admin, professional | — | Inscritos con nombre y correo |
| `PATCH` | `/workshops/:id/enrollments/:enrollmentId/attendance` | admin, professional | — | Inscripción `attended` |

## Reportes (#25)

| Método | Ruta | Perfiles | Filtros | Respuesta |
|---|---|---|---|---|
| `GET` | `/reports/summary?from=&to=&campus=` | admin | `from`, `to` (fechas `YYYY-MM-DD`; `to` incluye el día completo), `campus` (id) | Indicadores agregados |

```json
{
  "period": { "from": null, "to": null, "campus": null },
  "totalRequests": 42,
  "byStatus": { "received": 3, "classified": 2, "assigned": 5, "in_progress": 12, "closed": 20 },
  "byOrigin": { "self": 30, "referral": 12 },
  "byUrgency": { "low": 10, "medium": 20, "high": 12 },
  "byType": [{ "type": "Emocional", "count": 18 }],
  "byCampus": [{ "campus": "Casa central", "count": 25 }],
  "byMonth": [{ "month": "2026-10", "count": 15 }],
  "responseTimes": {
    "toAssignment": { "averageHours": 20.5, "cases": 37 },
    "toClosure": { "averageHours": 310.2, "cases": 20 }
  },
  "workshops": {
    "workshops": 6,
    "byStatus": { "scheduled": 4, "cancelled": 1, "finished": 1 },
    "enrollments": { "enrolled": 40, "attended": 25, "cancelled": 5 },
    "attendanceRate": 38
  }
}
```

Solo conteos y promedios: **sin nombres, correos, códigos de solicitud ni ids de estudiantes**.

## Bitácora (#15)

| Método | Ruta | Perfiles | Filtros | Respuesta |
|---|---|---|---|---|
| `GET` | `/audit-logs?entityId=&user=&action=&limit=` | admin | `action`: `login`, `login_failed`, `logout`, `view`, `create`, `update`, `classify`, `assign`, `close`; `limit` 1–500 (100 por defecto) | Registros más recientes primero |

Cada registro: `{ id, user, role, action, entity, entityId, changedFields, ip, createdAt }`. Guarda **qué campos**
cambiaron, nunca sus valores. Es de solo lectura.

## Otros

| Método | Ruta | Perfiles | Respuesta |
|---|---|---|---|
| `GET` | `/health` | Público | `{ "status": "ok" }` |

---

Hay una colección de Postman lista para probar todo en [`docs/postman/`](postman/), incluida la carpeta
**"Flujo completo"**, que recorre el camino de una solicitud de principio a fin.
