// Nombres en lenguaje claro de las acciones de la bitácora
export const AUDIT_ACTION_OPTIONS = [
  { value: 'login', label: 'Inicio de sesión', tone: 'info' },
  { value: 'login_failed', label: 'Intento fallido de ingreso', tone: 'danger' },
  { value: 'logout', label: 'Cierre de sesión', tone: 'neutral' },
  { value: 'view', label: 'Consulta de datos sensibles', tone: 'warning' },
  { value: 'create', label: 'Creación', tone: 'success' },
  { value: 'update', label: 'Modificación', tone: 'warning' },
  { value: 'classify', label: 'Clasificación', tone: 'info' },
  { value: 'assign', label: 'Asignación', tone: 'info' },
  { value: 'close', label: 'Cierre de caso', tone: 'neutral' },
]

export const ENTITY_LABELS = {
  User: 'Usuario',
  Catalog: 'Catálogo',
  SupportRequest: 'Solicitud de apoyo',
  FollowUp: 'Observación de seguimiento',
  Appointment: 'Cita',
  Workshop: 'Taller',
  Enrollment: 'Inscripción a taller',
}

export const actionInfo = (action) =>
  AUDIT_ACTION_OPTIONS.find((option) => option.value === action) ?? { label: action, tone: 'neutral' }
