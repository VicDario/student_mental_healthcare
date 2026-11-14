import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../auth/AuthContext'
import ApiMessage from '../components/ui/ApiMessage'
import Button from '../components/ui/Button'
import FormField from '../components/ui/form/FormField'
import Input from '../components/ui/form/Input'
import Panel from '../components/ui/Panel'
import { useSubmit } from '../hooks/useSubmit'
import { landingFor } from '../auth/roleHome'

// Cuentas de prueba creadas por `npm run seed` en el backend (contraseña 123456)
const TEST_USERS = [
  ['Estudiante', 'estudiante@test.cl'],
  ['Docente', 'docente@test.cl'],
  ['Consejero', 'consejero@test.cl'],
  ['Profesional', 'profesional@test.cl'],
  ['Administrador', 'admin@test.cl'],
]

export default function LoginPage() {
  const { user, login, sessionExpired } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { submit, pending, error, fieldError } = useSubmit()

  if (user) return <Navigate to={landingFor(user.role, location.state?.from)} replace />

  async function handleSubmit(event) {
    event.preventDefault()
    const logged = await submit(() => login(email, password))
    if (logged) navigate(landingFor(logged.role, location.state?.from), { replace: true })
  }

  return (
    <div className="mx-auto w-full max-w-110 px-4 pt-6 pb-16">
      <Panel id="login-title" title="Iniciar sesión">
        {sessionExpired && (
          <p role="status" className="mb-4 rounded-sm border border-warning-text/30 bg-warning-bg px-4 py-3 text-[0.875rem] text-warning-text">
            Tu sesión expiró por inactividad. Vuelve a ingresar para continuar.
          </p>
        )}

        <ApiMessage error={error && !error.errors?.length ? error : null} />

        <form onSubmit={handleSubmit} noValidate>
          <FormField id="login-email" label="Correo institucional" error={fieldError('email')}>
            <Input
              id="login-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nombre@test.cl"
            />
          </FormField>
          <FormField id="login-password" label="Contraseña" error={fieldError('password')}>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </FormField>
          <Button type="submit" className="mt-2 w-full" disabled={pending}>
            {pending ? 'Ingresando…' : 'Ingresar'}
          </Button>
        </form>

        <p className="mt-5 text-center text-[0.875rem] text-muted">
          ¿Eres estudiante y no tienes cuenta?{' '}
          <Link to="/registro" className="font-semibold text-forest-800 underline">
            Crear cuenta
          </Link>
        </p>

        <details className="mt-6 rounded-sm border border-border bg-subtle px-4 py-3 text-[0.8125rem] text-muted">
          <summary className="cursor-pointer font-semibold text-forest-900">Cuentas de prueba</summary>
          <ul className="mt-2 flex flex-col gap-1">
            {TEST_USERS.map(([label, testEmail]) => (
              <li key={testEmail}>
                <button
                  type="button"
                  className="cursor-pointer text-left underline decoration-dotted hover:text-forest-800"
                  onClick={() => {
                    setEmail(testEmail)
                    setPassword('123456')
                  }}
                >
                  {label}: {testEmail}
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-2">Contraseña de todas: 123456</p>
        </details>
      </Panel>
    </div>
  )
}
