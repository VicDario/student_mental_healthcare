export const PRIORITIES = [
  { value: 'low', label: 'Baja', tone: 'success' },
  { value: 'medium', label: 'Media', tone: 'warning' },
  { value: 'high', label: 'Alta', tone: 'danger' },
]

export const SUPPORT_TYPES = [
  { value: 'emotional', label: 'Emocional' },
  { value: 'academic', label: 'Académico' },
  { value: 'social', label: 'Social' },
  { value: 'economic', label: 'Económico' },
  { value: 'coexistence', label: 'Convivencia' },
  { value: 'other', label: 'Otro' },
]

export const UNITS = [
  { value: 'psychology', label: 'Atención psicológica' },
  { value: 'social', label: 'Trabajo social' },
  { value: 'counseling', label: 'Orientación estudiantil' },
  { value: 'academic', label: 'Apoyo académico' },
  { value: 'welfare', label: 'Dirección de bienestar' },
]

export const CAMPUSES = [
  { value: 'central', label: 'Casa central' },
  { value: 'north', label: 'Sede norte' },
  { value: 'south', label: 'Sede sur' },
]

export function findOption(options, value) {
  return options.find((option) => option.value === value)
}

export function labelOf(options, value, fallback = '') {
  return findOption(options, value)?.label ?? fallback
}
