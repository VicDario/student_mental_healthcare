export const WORKSHOP_CATEGORIES = [
  { value: 'Mindfulness y Calma', label: 'Mindfulness y Calma' },
  { value: 'Manejo del Estrés', label: 'Manejo del Estrés' },
  { value: 'Adaptación Universitaria', label: 'Adaptación Universitaria' },
  { value: 'Habilidades Sociales', label: 'Habilidades Sociales' },
  { value: 'Higiene del Sueño', label: 'Higiene del Sueño' },
]

export const MODALITIES = [
  { value: 'Presencial', label: 'Presencial' },
  { value: 'Virtual (Zoom)', label: 'Virtual (Zoom)' },
  { value: 'Híbrida', label: 'Híbrida' },
]

export const INITIAL_WORKSHOPS = [
  {
    id: 'TAL-001',
    title: 'Mindfulness y Reducción del Estrés',
    category: 'Mindfulness y Calma',
    facilitator: 'Ps. Carolina Muñoz',
    facilitatorRole: 'Psicología Clínica',
    avatar: '👩‍⚕️',
    schedule: 'Miércoles 15:00 - 16:30',
    location: 'Sala Multiuso Campus Central',
    modality: 'Presencial',
    enrolled: 18,
    capacity: 20,
    status: 'warning', // 90%
  },
  {
    id: 'TAL-002',
    title: 'Vencer la Procrastinación Académica',
    category: 'Manejo del Estrés',
    facilitator: 'Dr. Rodrigo Valenzuela',
    facilitatorRole: 'Apoyo al Aprendizaje',
    avatar: '👨‍⚕️',
    schedule: 'Jueves 17:00 - 18:30',
    location: 'Plataforma Zoom DAE',
    modality: 'Virtual (Zoom)',
    enrolled: 25,
    capacity: 30,
    status: 'normal', // 83%
  },
  {
    id: 'TAL-003',
    title: 'Círculo de Acompañamiento: Regiones',
    category: 'Adaptación Universitaria',
    facilitator: 'Lic. Camila Torres',
    facilitatorRole: 'Integración Estudiantil',
    avatar: '👩‍🏫',
    schedule: 'Viernes 12:30 - 14:00',
    location: 'Terraza DAE, Central',
    modality: 'Presencial',
    enrolled: 15,
    capacity: 15,
    status: 'full', // 100%
  },
  {
    id: 'TAL-004',
    title: 'Técnicas de Respiración y Ataques de Pánico',
    category: 'Manejo del Estrés',
    facilitator: 'Ps. Sofía Morales',
    facilitatorRole: 'Intervención en Crisis',
    avatar: '👩‍⚕️',
    schedule: 'Martes 10:00 - 11:30',
    location: 'Box Terapéutico 4',
    modality: 'Presencial',
    enrolled: 8,
    capacity: 12,
    status: 'normal', // 66%
  },
  {
    id: 'TAL-005',
    title: 'Taller: Higiene del Sueño en Exámenes',
    category: 'Higiene del Sueño',
    facilitator: 'Dr. Ignacio San Martín',
    facilitatorRole: 'Medicina del Sueño',
    avatar: '👨‍⚕️',
    schedule: 'Lunes 18:00 - 19:30',
    location: 'Streaming Teams',
    modality: 'Virtual (Zoom)',
    enrolled: 22,
    capacity: 40,
    status: 'normal', // 55%
  },
]
