import { useState } from 'react'
import { api } from '../../api/client'
import { useSubmit } from '../../hooks/useSubmit'
import ApiMessage from '../ui/ApiMessage'
import Button from '../ui/Button'
import FormActions from '../ui/form/FormActions'
import FormField from '../ui/form/FormField'
import Textarea from '../ui/form/Textarea'

// Registra una observación de seguimiento (POST /api/requests/:id/follow-ups).
// Se guarda cifrada y el estudiante nunca la ve.
export default function FollowUpForm({ requestId, onSaved }) {
  const [text, setText] = useState('')
  const { submit, pending, error, success, fieldError } = useSubmit()

  async function handleSubmit(event) {
    event.preventDefault()
    const saved = await submit(
      () => api(`/requests/${requestId}/follow-ups`, { method: 'POST', body: { text } }),
      'Observación registrada.',
    )
    if (saved) {
      setText('')
      onSaved()
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <ApiMessage error={error} success={success} />
      <FormField
        id="follow-up-text"
        label="Nueva observación"
        hint="Solo la ven profesionales, consejeros y administradores. Usa un lenguaje respetuoso."
        error={fieldError('text')}
      >
        <Textarea
          id="follow-up-text"
          value={text}
          maxLength={5000}
          onChange={(event) => setText(event.target.value)}
          placeholder="Avances de la sesión, acuerdos y próximos pasos"
        />
      </FormField>
      <FormActions>
        <Button type="submit" disabled={pending}>
          {pending ? 'Guardando…' : 'Registrar observación'}
        </Button>
      </FormActions>
    </form>
  )
}
