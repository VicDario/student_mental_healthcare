import { Navigate, useLocation } from 'react-router'
import ButtonLink from '../components/ui/ButtonLink'
import { useAuth } from './AuthContext'

// Protege una página: exige sesión y, si se indican, uno de los perfiles permitidos
export default function RequireRole({ roles, children }) {
  const { user, checking, loggedOut } = useAuth()
  const location = useLocation()

  if (checking) {
    return <p className="px-5 py-24 text-center text-muted">Cargando tu sesión…</p>
  }

  // Recuerda la página pedida solo si no se cerró sesión a propósito
  if (!user) {
    return <Navigate to="/login" replace state={loggedOut ? undefined : { from: location.pathname }} />
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <section className="mx-auto max-w-180 px-5 py-24 text-center">
        <h1 className="mb-3 text-[2rem] font-extrabold tracking-tight text-forest-900">Sin acceso a esta sección</h1>
        <p className="mb-8 text-muted">Tu perfil no tiene permiso para ver esta página.</p>
        <ButtonLink to="/">Volver al inicio</ButtonLink>
      </section>
    )
  }

  return children
}
