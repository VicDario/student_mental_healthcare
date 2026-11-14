import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { api } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { landingFor } from '../auth/roleHome'
import ApiMessage from '../components/ui/ApiMessage'
import Button from '../components/ui/Button'
import FormField from '../components/ui/form/FormField'
import Input from '../components/ui/form/Input'
import Panel from '../components/ui/Panel'
import { useSubmit } from '../hooks/useSubmit'

const EMPTY_FORM = { name: '', email: '', password: '', studentCode: '', program: '', phone: '' }

// Registro público (POST /api/auth/register). Solo crea estudiantes;
// los demás perfiles los crea un administrador en Administración de usuarios.
export default function RegisterPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY_FORM)
  const { submit, pending, error, fieldError } = useSubmit()

  if (user) return <Navigate to={landingFor(user.role)} replace />

  const update = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))

  async function handleSubmit(event) {
    event.preventDefault()
    // Los campos opcionales vacíos no se envían
    const body = Object.fromEntries(Object.entries(form).filter(([, value]) => value.trim() !== ''))
    const logged = await submit(async () => {
      await api('/auth/register', { method: 'POST', body })
      return login(form.email, form.password)
    })
    if (logged) navigate(landingFor(logged.role), { replace: true })
  }

  return (
    <div className="mx-auto w-full max-w-130 px-4 pt-6 pb-16">
      <Panel id="register-title" title="Crear cuenta de estudiante">
        <p className="mb-4 text-[0.875rem] text-muted">
          Docentes, consejeros y profesionales reciben su cuenta desde Bienestar Estudiantil.
        </p>

        <ApiMessage error={error && !error.errors?.length ? error : null} />

        <form onSubmit={handleSubmit} noValidate>
          <FormField id="register-name" label="Nombre completo" error={fieldError('name')}>
            <Input id="register-name" autoComplete="name" value={form.name} onChange={update('name')} />
          </FormField>
          <FormField id="register-email" label="Correo institucional" error={fieldError('email')}>
            <Input
              id="register-email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={update('email')}
              placeholder="nombre@test.cl"
            />
          </FormField>
          <FormField id="register-password" label="Contraseña (mínimo 6 caracteres)" error={fieldError('password')}>
            <Input
              id="register-password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={update('password')}
            />
          </FormField>
          <FormField id="register-student-code" label="Código de estudiante (opcional)" error={fieldError('studentCode')}>
            <Input id="register-student-code" value={form.studentCode} onChange={update('studentCode')} />
          </FormField>
          <FormField id="register-program" label="Carrera (opcional)" error={fieldError('program')}>
            <Input id="register-program" value={form.program} onChange={update('program')} />
          </FormField>
          <FormField id="register-phone" label="Teléfono (opcional)" error={fieldError('phone')}>
            <Input id="register-phone" type="tel" autoComplete="tel" value={form.phone} onChange={update('phone')} />
          </FormField>
          <Button type="submit" className="mt-2 w-full" disabled={pending}>
            {pending ? 'Creando cuenta…' : 'Crear cuenta'}
          </Button>
        </form>

        <p className="mt-5 text-center text-[0.875rem] text-muted">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-semibold text-forest-800 underline">
            Inicia sesión
          </Link>
        </p>
      </Panel>
    </div>
  )
}
