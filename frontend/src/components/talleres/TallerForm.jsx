import { useState } from 'react'
import { api } from '../../api/client'
import { useApi } from '../../hooks/useApi'
import { useSubmit } from '../../hooks/useSubmit'
import { toOptions } from '../../utils/labels'
import { KIND_OPTIONS, WORKSHOP_MODALITY_OPTIONS } from '../../utils/workshops'
import ApiMessage from '../ui/ApiMessage'
import Button from '../ui/Button'
import FormField from '../ui/form/FormField'
import Input from '../ui/form/Input'
import Select from '../ui/form/Select'
import Textarea from '../ui/form/Textarea'
import Panel from '../ui/Panel'

const EMPTY = {
  title: '',
  kind: 'workshop',
  category: '',
  modality: 'in_person',
  campus: '',
  location: '',
  date: '',
  startTime: '',
  endTime: '',
  capacity: '20',
  description: '',
}

const toIso = (date, time) => (date && time ? new Date(`${date}T${time}`).toISOString() : undefined)

// Crea un taller (POST /api/workshops). Queda a cargo de quien lo crea
export default function TallerForm({ onCreated }) {
  const [form, setForm] = useState(EMPTY)
  const campuses = useApi('/catalogs?type=campus')
  const { submit, pending, error, success, fieldError } = useSubmit()
  const update = (event) => setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))

  async function handleSubmit(event) {
    event.preventDefault()
    const created = await submit(
      () =>
        api('/workshops', {
          method: 'POST',
          body: {
            title: form.title,
            kind: form.kind,
            category: form.category || undefined,
            modality: form.modality,
            campus: form.campus || undefined,
            location: form.location || undefined,
            startsAt: toIso(form.date, form.startTime),
            endsAt: toIso(form.date, form.endTime),
            capacity: Number(form.capacity),
            description: form.description || undefined,
          },
        }),
      'Actividad publicada. Los estudiantes ya pueden inscribirse.',
    )
    if (created) {
      setForm(EMPTY)
      onCreated()
    }
  }

  return (
    <Panel id="panelCrear" title="Nueva actividad">
      <ApiMessage error={error} success={success} />
      <form onSubmit={handleSubmit} noValidate>
        <FormField id="title" label="Título *" className="mb-3" error={fieldError('title')}>
          <Input id="title" name="title" value={form.title} onChange={update} placeholder="Ej.: Taller de asertividad" />
        </FormField>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormField id="kind" label="Tipo *" className="mb-3" error={fieldError('kind')}>
            <Select id="kind" name="kind" value={form.kind} onChange={update} options={KIND_OPTIONS} />
          </FormField>
          <FormField id="category" label="Tema" className="mb-3">
            <Input id="category" name="category" value={form.category} onChange={update} placeholder="Manejo del estrés" />
          </FormField>
        </div>

        <FormField id="date" label="Fecha *" className="mb-3" error={fieldError('startsAt') ?? fieldError('endsAt')}>
          <Input id="date" name="date" type="date" value={form.date} onChange={update} />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField id="startTime" label="Inicio *" className="mb-3">
            <Input id="startTime" name="startTime" type="time" value={form.startTime} onChange={update} />
          </FormField>
          <FormField id="endTime" label="Término *" className="mb-3">
            <Input id="endTime" name="endTime" type="time" value={form.endTime} onChange={update} />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormField id="capacity" label="Cupos *" className="mb-3" error={fieldError('capacity')}>
            <Input id="capacity" name="capacity" type="number" min="1" max="500" value={form.capacity} onChange={update} />
          </FormField>
          <FormField id="modality" label="Modalidad *" className="mb-3" error={fieldError('modality')}>
            <Select id="modality" name="modality" value={form.modality} onChange={update} options={WORKSHOP_MODALITY_OPTIONS} />
          </FormField>
        </div>

        <FormField id="campus" label="Sede" className="mb-3" error={fieldError('campus')}>
          <Select id="campus" name="campus" value={form.campus} onChange={update} options={toOptions(campuses.data ?? [])} placeholder="Sin sede" />
        </FormField>

        <FormField id="location" label="Lugar o enlace" className="mb-3">
          <Input id="location" name="location" value={form.location} onChange={update} placeholder="Ej.: Sala 2 o enlace de Zoom" />
        </FormField>

        <FormField id="description" label="Objetivos o requisitos" className="mb-4">
          <Textarea id="description" name="description" rows={2} value={form.description} onChange={update} placeholder="Detalles para los inscritos" />
        </FormField>

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? 'Publicando…' : 'Publicar actividad'}
        </Button>
      </form>
    </Panel>
  )
}
