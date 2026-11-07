import { useState } from 'react'
import { api } from '../../api/client'
import { useSubmit } from '../../hooks/useSubmit'
import { toOptions } from '../../utils/labels'
import ApiMessage from '../ui/ApiMessage'
import Button from '../ui/Button'
import Choice from '../ui/form/Choice'
import FormActions from '../ui/form/FormActions'
import FormField from '../ui/form/FormField'
import Select from '../ui/form/Select'

// El consejero define el tipo de apoyo y la prioridad (PATCH /api/requests/:id/classify)
export default function ClassifyForm({ request, supportTypes, onSaved }) {
  const [type, setType] = useState(request.type?.id ?? '')
  const [priority, setPriority] = useState(request.priority ?? request.perceivedUrgency ?? 'medium')
  const { submit, pending, error, success, fieldError } = useSubmit()

  async function handleSubmit(event) {
    event.preventDefault()
    const saved = await submit(
      () => api(`/requests/${request.id}/classify`, { method: 'PATCH', body: { type, priority } }),
      'Clasificación guardada. El estudiante recibió un aviso.',
    )
    if (saved) onSaved(saved)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <ApiMessage error={error} success={success} />
      <FormField id="request-type" label="Tipo de apoyo *" hint="Solo aparecen los tipos activos del catálogo." error={fieldError('type')}>
        <Select
          id="request-type"
          value={type}
          onChange={(event) => setType(event.target.value)}
          options={toOptions(supportTypes)}
          placeholder="Selecciona una opción"
        />
      </FormField>

      <fieldset className="mb-4 rounded-sm border-[1.5px] border-border p-4">
        <legend className="px-1 text-[0.8125rem] font-semibold text-forest-900">Prioridad de atención *</legend>
        <div className="mt-1 flex flex-wrap gap-4">
          {[
            ['low', 'Baja'],
            ['medium', 'Media'],
            ['high', 'Alta'],
          ].map(([value, label]) => (
            <Choice key={value} type="radio" name="priority" value={value} checked={priority === value} onChange={() => setPriority(value)}>
              {label}
            </Choice>
          ))}
        </div>
      </fieldset>

      <FormActions>
        <Button type="submit" disabled={pending}>
          {pending ? 'Guardando…' : 'Guardar clasificación'}
        </Button>
      </FormActions>
    </form>
  )
}
