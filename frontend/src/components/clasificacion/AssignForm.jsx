import { useState } from 'react'
import { api } from '../../api/client'
import { useSubmit } from '../../hooks/useSubmit'
import { roleLabel } from '../../utils/labels'
import ApiMessage from '../ui/ApiMessage'
import Button from '../ui/Button'
import FormActions from '../ui/form/FormActions'
import FormField from '../ui/form/FormField'
import Select from '../ui/form/Select'

// Asigna la solicitud a un profesional o consejero activo (PATCH /api/requests/:id/assign)
export default function AssignForm({ request, staff, onSaved }) {
  const [assignedTo, setAssignedTo] = useState(request.assignedTo?.id ?? '')
  const { submit, pending, error, success, fieldError } = useSubmit()

  const options = staff.map((member) => ({
    value: member.id,
    label: `${member.name} · ${roleLabel(member.role)}${member.unit?.name ? ` · ${member.unit.name}` : ''}`,
  }))

  async function handleSubmit(event) {
    event.preventDefault()
    const saved = await submit(
      () => api(`/requests/${request.id}/assign`, { method: 'PATCH', body: { assignedTo } }),
      'Solicitud asignada. El profesional ya puede verla y el estudiante recibió un aviso.',
    )
    if (saved) onSaved(saved)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <ApiMessage error={error} success={success} />
      <FormField id="assigned-to" label="Profesional responsable *" error={fieldError('assignedTo')}>
        <Select
          id="assigned-to"
          value={assignedTo}
          onChange={(event) => setAssignedTo(event.target.value)}
          options={options}
          placeholder="Selecciona a quién asignar"
        />
      </FormField>
      <FormActions>
        <Button type="submit" disabled={pending}>
          {pending ? 'Asignando…' : request.assignedTo ? 'Reasignar' : 'Asignar'}
        </Button>
      </FormActions>
    </form>
  )
}
