// Página de inicio de cada perfil después de iniciar sesión
export const HOME_BY_ROLE = {
  student: '/solicitud-apoyo',
  teacher: '/derivacion-docente',
  counselor: '/clasificacion',
  professional: '/seguimiento',
  admin: '/reportes',
}

// Enlaces del menú según el perfil
export const LINKS_BY_ROLE = {
  student: [
    { label: 'Mis solicitudes', to: '/solicitud-apoyo' },
    { label: 'Talleres', to: '/talleres' },
  ],
  teacher: [{ label: 'Derivar', to: '/derivacion-docente' }],
  counselor: [
    { label: 'Clasificar', to: '/clasificacion' },
    { label: 'Seguimiento', to: '/seguimiento' },
    { label: 'Citas', to: '/agendar-cita' },
  ],
  professional: [
    { label: 'Seguimiento', to: '/seguimiento' },
    { label: 'Citas', to: '/agendar-cita' },
    { label: 'Talleres', to: '/gestionar-talleres' },
  ],
  admin: [
    { label: 'Asignar', to: '/clasificacion' },
    { label: 'Seguimiento', to: '/seguimiento' },
    { label: 'Talleres', to: '/gestionar-talleres' },
    { label: 'Reportes', to: '/reportes' },
    { label: 'Bitácora', to: '/bitacora' },
    { label: 'Usuarios', to: '/admin-usuarios' },
  ],
}

// Después del login: vuelve a la página pedida solo si el perfil puede verla
export function landingFor(role, from) {
  const allowed = LINKS_BY_ROLE[role]?.some((link) => link.to === from)
  return allowed ? from : (HOME_BY_ROLE[role] ?? '/')
}
