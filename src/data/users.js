// Datos de ejemplo para la administración de usuarios.
// Más adelante vendrán del backend.

export const ADMIN_SECTIONS = ['Usuarios', 'Perfiles y permisos', 'Tipos de solicitud', 'Sedes', 'Unidades de apoyo']

export const PROFILES = [
  { value: 'student', label: 'Estudiante' },
  { value: 'teacher', label: 'Docente' },
  { value: 'counselor', label: 'Consejero' },
  { value: 'professional', label: 'Profesional de apoyo' },
  { value: 'admin', label: 'Administrador de bienestar' },
]

export const USER_STATS = [
  { value: 6, label: 'Cuentas registradas' },
  { value: 5, label: 'Cuentas activas', tone: 'success' },
  { value: 3, label: 'Sedes cubiertas' },
  { value: 5, label: 'Perfiles definidos' },
]

export const USERS = [
  { name: 'Ana Pérez Soto', email: 'ana.perez@estudiante.unab.cl', profile: 'Estudiante', campus: 'Casa central', active: true },
  { name: 'Rodrigo Salas Vera', email: 'rodrigo.salas@unab.cl', profile: 'Docente', campus: 'Sede norte', active: true },
  { name: 'Camila Ortiz Rojas', email: 'camila.ortiz@unab.cl', profile: 'Consejero', campus: 'Casa central', active: true },
  { name: 'Felipe Cárdenas Lira', email: 'felipe.cardenas@unab.cl', profile: 'Profesional de apoyo', campus: 'Sede sur', active: true },
  { name: 'Javiera Núñez Paredes', email: 'javiera.nunez@unab.cl', profile: 'Profesional de apoyo', campus: 'Sede norte', active: false },
  { name: 'Carla Muñoz Tapia', email: 'carla.munoz@unab.cl', profile: 'Administrador de bienestar', campus: 'Casa central', active: true },
]
