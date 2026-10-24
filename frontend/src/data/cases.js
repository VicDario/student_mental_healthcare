export const CASE_STATUSES = [
  { value: 'following', label: 'En seguimiento' },
  { value: 'pending', label: 'Pendiente revisión' },
  { value: 'ready', label: 'Listo para cierre' },
  { value: 'closed', label: 'Cerrado' },
]

export const CLOSE_REASONS = [
  { value: 'resolved', label: 'Caso resuelto satisfactoriamente' },
  { value: 'voluntary', label: 'Alta voluntaria del estudiante' },
  { value: 'referral', label: 'Derivación a servicio externo' },
  { value: 'no-response', label: 'Sin respuesta del estudiante (3 intentos)' },
  { value: 'admin', label: 'Cierre administrativo' },
]

export const CASE_STATS = [
  { value: 5, label: 'Casos activos' },
  { value: 1, label: 'Pendientes de revisión', tone: 'warning' },
  { value: 2, label: 'Listos para cierre' },
  { value: 7, label: 'Cerrados este mes', tone: 'success' },
]

export const CASES = [
  {
    id: 'CAS-0089',
    title: 'Acompañamiento en crisis',
    professional: 'Psic. Valentina Rojas',
    unit: 'Atención psicológica',
    campus: 'Casa central',
    status: { label: 'En seguimiento', tone: 'success' },
    priority: { label: 'Alta', tone: 'danger' },
    contact: 'Último contacto: 2 sep 2026',
    sensitive: true,
    timeline: [
      {
        date: '24 ago 2026',
        title: 'Solicitud recibida y clasificada',
        description: 'Urgencia alta. Derivada de inmediato a atención psicológica.',
      },
      {
        date: '25 ago 2026',
        title: 'Primera sesión de acompañamiento',
        description: 'Se establece rapport y se aplica evaluación inicial. Signos de ansiedad moderada.',
      },
      {
        date: '28 ago 2026',
        title: 'Segunda sesión — ajuste del plan',
        description: 'Se incorpora red de apoyo familiar y se ajustan los objetivos terapéuticos.',
      },
      {
        date: '2 sep 2026',
        title: 'Seguimiento telefónico',
        description: 'Estudiante reporta mejoría. Confirma asistencia a próxima sesión.',
      },
      { date: '9 sep 2026', title: 'Tercera sesión (programada)', pending: true },
    ],
  },
  {
    id: 'CAS-0091',
    title: 'Seguimiento preventivo primer año',
    professional: 'T.S. Marcela Fuentes',
    unit: 'Trabajo social',
    campus: 'Sede norte',
    status: { label: 'En seguimiento', tone: 'success' },
    priority: { label: 'Media', tone: 'warning' },
    contact: 'Último contacto: 5 sep 2026',
  },
  {
    id: 'CAS-0085',
    title: 'Dificultades de convivencia grupal',
    professional: 'Sin asignar',
    unit: 'Orientación estudiantil',
    campus: 'Casa central',
    status: { label: 'Pendiente revisión', tone: 'warning' },
    priority: { label: 'Media', tone: 'warning' },
    contact: 'Recibido: 30 ago 2026',
  },
  {
    id: 'CAS-0078',
    title: 'Orientación económica y beneficios',
    professional: 'Dir. Gabriela Muñoz',
    unit: 'Dirección de bienestar',
    campus: 'Sede sur',
    status: { label: 'Listo para cierre', tone: 'info' },
    priority: { label: 'Baja', tone: 'success' },
    contact: 'Último contacto: 4 sep 2026',
  },
  {
    id: 'CAS-0072',
    title: 'Apoyo académico semestre crítico',
    professional: 'Prof. Ricardo Soto',
    unit: 'Apoyo académico',
    campus: 'Sede sur',
    status: { label: 'Listo para cierre', tone: 'info' },
    priority: { label: 'Baja', tone: 'success' },
    contact: 'Último contacto: 3 sep 2026',
  },
]
