export const CASE_STATUSES = [
  { value: 'following', label: 'En seguimiento', tone: 'success' },
  { value: 'pending', label: 'Pendiente revisión', tone: 'warning' },
  { value: 'ready', label: 'Listo para cierre', tone: 'info' },
  { value: 'closed', label: 'Cerrado', tone: 'neutral' },
]

export const CLOSE_REASONS = [
  { value: 'resolved', label: 'Caso resuelto satisfactoriamente' },
  { value: 'voluntary', label: 'Alta voluntaria del estudiante' },
  { value: 'referral', label: 'Derivación a servicio externo' },
  { value: 'no-response', label: 'Sin respuesta del estudiante (3 intentos)' },
  { value: 'admin', label: 'Cierre administrativo' },
]

export const CLOSED_THIS_MONTH = 7

export const CASES = [
  {
    id: 'CAS-0089',
    title: 'Acompañamiento en crisis',
    professional: 'Psic. Valentina Rojas',
    unit: 'psychology',
    campus: 'central',
    status: 'following',
    priority: 'high',
    sensitive: true,
    lastContact: '2026-09-02',
    timeline: [
      {
        date: '2026-08-24',
        title: 'Solicitud recibida y clasificada',
        description: 'Urgencia alta. Derivada de inmediato a atención psicológica.',
      },
      {
        date: '2026-08-25',
        title: 'Primera sesión de acompañamiento',
        description: 'Se establece rapport y se aplica evaluación inicial. Signos de ansiedad moderada.',
      },
      {
        date: '2026-08-28',
        title: 'Segunda sesión — ajuste del plan',
        description: 'Se incorpora red de apoyo familiar y se ajustan los objetivos terapéuticos.',
      },
      {
        date: '2026-09-02',
        title: 'Seguimiento telefónico',
        description: 'Estudiante reporta mejoría. Confirma asistencia a próxima sesión.',
      },
      { date: '2026-09-09', title: 'Tercera sesión (programada)', pending: true },
    ],
  },
  {
    id: 'CAS-0091',
    title: 'Seguimiento preventivo primer año',
    professional: 'T.S. Marcela Fuentes',
    unit: 'social',
    campus: 'north',
    status: 'following',
    priority: 'medium',
    sensitive: true,
    lastContact: '2026-09-05',
    timeline: [
      {
        date: '2026-08-25',
        title: 'Derivación docente recibida',
        description: 'Docente de primer año solicita acompañamiento preventivo para el estudiante.',
      },
      {
        date: '2026-08-27',
        title: 'Entrevista inicial con trabajo social',
        description: 'Se identifican dificultades de adaptación y carga laboral fuera de la universidad.',
      },
      {
        date: '2026-09-05',
        title: 'Seguimiento presencial',
        description: 'Se coordina apoyo con el tutor académico de la carrera.',
      },
      { date: '2026-09-12', title: 'Reunión de seguimiento (programada)', pending: true },
    ],
  },
  {
    id: 'CAS-0085',
    title: 'Dificultades de convivencia grupal',
    professional: 'Sin asignar',
    unit: 'counseling',
    campus: 'central',
    status: 'pending',
    priority: 'medium',
    sensitive: false,
    lastContact: '2026-08-30',
    timeline: [
      {
        date: '2026-08-30',
        title: 'Solicitud recibida',
        description: 'Estudiante reporta conflictos recurrentes en trabajos grupales de su carrera.',
      },
      { title: 'Asignación de profesional (pendiente)', pending: true },
    ],
  },
  {
    id: 'CAS-0078',
    title: 'Orientación económica y beneficios',
    professional: 'Dir. Gabriela Muñoz',
    unit: 'welfare',
    campus: 'south',
    status: 'ready',
    priority: 'low',
    sensitive: false,
    lastContact: '2026-09-04',
    timeline: [
      {
        date: '2026-08-18',
        title: 'Solicitud clasificada',
        description: 'Derivada a dirección de bienestar por consulta sobre apoyos económicos.',
      },
      {
        date: '2026-08-21',
        title: 'Revisión de beneficios disponibles',
        description: 'Se informa sobre beca de alimentación y fondo de emergencia estudiantil.',
      },
      {
        date: '2026-09-04',
        title: 'Beneficio asignado',
        description: 'Estudiante confirma recepción del beneficio. Se propone el cierre del caso.',
      },
    ],
  },
  {
    id: 'CAS-0072',
    title: 'Apoyo académico semestre crítico',
    professional: 'Prof. Ricardo Soto',
    unit: 'academic',
    campus: 'south',
    status: 'ready',
    priority: 'low',
    sensitive: false,
    lastContact: '2026-09-03',
    timeline: [
      {
        date: '2026-08-10',
        title: 'Solicitud recibida y clasificada',
        description: 'Bajo rendimiento en asignaturas críticas del semestre.',
      },
      {
        date: '2026-08-14',
        title: 'Plan de estudio personalizado',
        description: 'Se definen metas semanales y sesiones de tutoría.',
      },
      {
        date: '2026-09-03',
        title: 'Evaluación de avance',
        description: 'Estudiante aprueba evaluaciones parciales. Objetivos cumplidos.',
      },
    ],
  },
]
