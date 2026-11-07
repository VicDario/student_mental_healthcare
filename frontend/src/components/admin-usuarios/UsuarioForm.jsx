import { useState } from 'react'
import { api } from '../../api/client'
import { useSubmit } from '../../hooks/useSubmit'
import { ROLE_OPTIONS, toOptions } from '../../utils/labels'
import ApiMessage from '../ui/ApiMessage'
import Button from '../ui/Button'
import FormActions from '../ui/form/FormActions'
import FormField from '../ui/form/FormField'
import Input from '../ui/form/Input'
import Select from '../ui/form/Select'

const EMPTY = { name: '', email: '', password: '', role: '', campus: '', unit: '', studentCode: '', program: '' }

// Crea una cuenta (POST /api/users). Los errores de la API aparecen bajo cada campo
export default function UsuarioForm({ campuses, units, onCreated }) {
  const [form, setForm] = useState(EMPTY)
  const { submit, pending, error, success, fieldError } = useSubmit()
  const update = (event) => setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  const isStudent = form.role === 'student'
  const isStaff = ['professional', 'counselor'].includes(form.role)

  async function handleSubmit(event) {
    event.preventDefault()
    // Solo se envían los campos con valor
    const body = Object.fromEntries(Object.entries(form).filter(([, value]) => value !== ''))
    const created = await submit(() => api('/users', { method: 'POST', body }), 'Cuenta creada. Ya puede iniciar sesión.')
    if (created) {
      setForm(EMPTY)
      onCreated()
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <ApiMessage error={error} success={success} />
      <p className="mb-4 text-[0.8125rem] text-muted">Los campos marcados con asterisco son obligatorios.</p>

      <div className="grid gap-x-4 sm:grid-cols-2">
        <FormField id="user-name" label="Nombre completo *" error={fieldError('name')}>
          <Input id="user-name" name="name" value={form.name} onChange={update} placeholder="Ana Pérez Soto" />
        </FormField>
        <FormField id="user-email" label="Correo institucional *" error={fieldError('email')}>
          <Input id="user-email" name="email" type="email" value={form.email} onChange={update} placeholder="ana.perez@unab.cl" />
        </FormField>
        <FormField id="user-password" label="Contraseña inicial *" hint="Mínimo 6 caracteres." error={fieldError('password')}>
          <Input id="user-password" name="password" type="password" autoComplete="new-password" value={form.password} onChange={update} />
        </FormField>
        <FormField id="user-role" label="Perfil institucional *" error={fieldError('role')}>
          <Select id="user-role" name="role" value={form.role} onChange={update} options={ROLE_OPTIONS} placeholder="Selecciona un perfil" />
        </FormField>
        <FormField id="user-campus" label="Sede" error={fieldError('campus')}>
          <Select id="user-campus" name="campus" value={form.campus} onChange={update} options={toOptions(campuses)} placeholder="Sin sede" />
        </FormField>
        {isStaff && (
          <FormField id="user-unit" label="Unidad de apoyo" error={fieldError('unit')}>
            <Select id="user-unit" name="unit" value={form.unit} onChange={update} options={toOptions(units)} placeholder="Sin unidad" />
          </FormField>
        )}
        {isStudent && (
          <>
            <FormField id="user-code" label="Matrícula" error={fieldError('studentCode')}>
              <Input id="user-code" name="studentCode" value={form.studentCode} onChange={update} placeholder="20261234" />
            </FormField>
            <FormField id="user-program" label="Carrera" error={fieldError('program')}>
              <Input id="user-program" name="program" value={form.program} onChange={update} placeholder="Ingeniería en Computación" />
            </FormField>
          </>
        )}
      </div>

      <FormActions>
        <Button type="submit" disabled={pending}>
          {pending ? 'Creando…' : 'Registrar cuenta'}
        </Button>
        <Button variant="secondary" onClick={() => setForm(EMPTY)}>
          Limpiar formulario
        </Button>
      </FormActions>
    </form>
  )
}
