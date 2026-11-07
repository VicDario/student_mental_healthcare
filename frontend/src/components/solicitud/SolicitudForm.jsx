import { useState } from 'react'
import { api } from '../../api/client'
import { useSubmit } from '../../hooks/useSubmit'
import ApiMessage from '../ui/ApiMessage'
import Button from '../ui/Button'
import Choice from '../ui/form/Choice'
import FormActions from '../ui/form/FormActions'
import FormField from '../ui/form/FormField'
import Input from '../ui/form/Input'
import Select from '../ui/form/Select'
import Textarea from '../ui/form/Textarea'

const sectionTitleClass = 'mb-4 text-[1rem] font-bold text-title'

const URGENCY_CHOICES = [
  { value: 'low', label: 'Baja, puedo esperar unos días' },
  { value: 'medium', label: 'Media, me gustaría respuesta esta semana' },
  { value: 'high', label: 'Alta, necesito hablar con alguien pronto' },
]

const CONTACT_CHANNELS = [
  { value: 'email', label: 'Correo' },
  { value: 'phone', label: 'Teléfono' },
]

const EMPTY = { reason: '', description: '', perceivedUrgency: '', channel: 'email', contactValue: '' }

// Crea una solicitud de apoyo (POST /api/requests) y muestra los errores de la API bajo cada campo
export default function SolicitudForm({ defaultEmail, onCreated }) {
  const [form, setForm] = useState({ ...EMPTY, contactValue: defaultEmail ?? '' })
  const [consent, setConsent] = useState(false)
  const { submit, pending, error, success, fieldError } = useSubmit()

  const update = (event) => setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))

  async function handleSubmit(event) {
    event.preventDefault()
    const created = await submit(
      () =>
        api('/requests', {
          method: 'POST',
          body: {
            reason: form.reason,
            description: form.description,
            perceivedUrgency: form.perceivedUrgency || undefined,
            contact: { channel: form.channel, value: form.contactValue },
          },
        }),
      'Recibimos tu solicitud. Te avisaremos aquí cuando un consejero la revise.',
    )
    if (created) {
      setForm({ ...EMPTY, contactValue: defaultEmail ?? '' })
      setConsent(false)
      onCreated?.(created)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <ApiMessage error={error} success={success} />
      <p className="mb-5 text-[0.8125rem] text-muted">Los campos marcados con asterisco son obligatorios.</p>

      <h3 className={sectionTitleClass}>Tu solicitud</h3>

      <FormField id="request-reason" label="Motivo breve *" error={fieldError('reason')}>
        <Input
          id="request-reason"
          name="reason"
          value={form.reason}
          onChange={update}
          placeholder="Dificultad para concentrarme y dormir"
        />
      </FormField>

      <FormField
        id="request-description"
        label="Descripción *"
        hint={`${form.description.length} / 600 caracteres`}
        error={fieldError('description')}
      >
        <Textarea
          id="request-description"
          name="description"
          rows={6}
          maxLength={600}
          value={form.description}
          onChange={update}
          placeholder="Escribe con tus palabras qué te está pasando y desde cuándo."
        />
      </FormField>

      <fieldset className="mb-4 rounded-sm border-[1.5px] border-border p-4">
        <legend className="px-1 text-[0.8125rem] font-semibold text-forest-900">¿Qué tan urgente lo sientes? *</legend>
        <div className="mt-1 flex flex-col gap-2">
          {URGENCY_CHOICES.map((option) => (
            <Choice
              key={option.value}
              type="radio"
              name="perceivedUrgency"
              value={option.value}
              checked={form.perceivedUrgency === option.value}
              onChange={update}
            >
              {option.label}
            </Choice>
          ))}
        </div>
        {fieldError('perceivedUrgency') && (
          <p className="mt-2 text-[0.8125rem] font-medium text-crisis-text">{fieldError('perceivedUrgency')}</p>
        )}
      </fieldset>

      {form.perceivedUrgency === 'high' && (
        <p className="mb-6 rounded-sm border border-crisis-border bg-crisis-bg px-4 py-3 text-[0.875rem] text-crisis-text">
          Tu solicitud entrará con prioridad. Si necesitas hablar con alguien ahora mismo, no esperes la respuesta de la
          plataforma: llama a Salud Responde al <strong>600 360 7777</strong>, disponible las 24 horas.
        </p>
      )}

      <h3 className={sectionTitleClass}>Cómo contactarte</h3>

      <div className="grid gap-x-4 sm:grid-cols-[180px_1fr]">
        <FormField id="request-channel" label="Vía preferida *" error={fieldError('contact.channel')}>
          <Select id="request-channel" name="channel" value={form.channel} onChange={update} options={CONTACT_CHANNELS} />
        </FormField>
        <FormField
          id="request-contact"
          label={form.channel === 'email' ? 'Correo de contacto *' : 'Teléfono de contacto *'}
          error={fieldError('contact.value') ?? fieldError('contact')}
        >
          <Input
            id="request-contact"
            name="contactValue"
            type={form.channel === 'email' ? 'email' : 'tel'}
            value={form.contactValue}
            onChange={update}
            placeholder={form.channel === 'email' ? 'nombre@test.cl' : '+56 9 1234 5678'}
          />
        </FormField>
      </div>

      <Choice name="consent" checked={consent} onChange={(event) => setConsent(event.target.checked)}>
        Autorizo que mi solicitud sea revisada y derivada por el equipo de bienestar estudiantil, según la pauta de uso
        responsable de datos. *
      </Choice>

      <FormActions>
        <Button type="submit" disabled={pending || !consent}>
          {pending ? 'Enviando…' : 'Enviar solicitud'}
        </Button>
      </FormActions>
    </form>
  )
}
