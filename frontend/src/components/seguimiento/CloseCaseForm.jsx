import { useState } from 'react'
import { api } from '../../api/client'
import { useSubmit } from '../../hooks/useSubmit'
import { REFERRAL_TYPE_OPTIONS } from '../../utils/labels'
import ApiMessage from '../ui/ApiMessage'
import Button from '../ui/Button'
import Choice from '../ui/form/Choice'
import FormActions from '../ui/form/FormActions'
import FormField from '../ui/form/FormField'
import Input from '../ui/form/Input'
import Select from '../ui/form/Select'
import Textarea from '../ui/form/Textarea'

// Cierra el caso con su motivo y la derivación realizada (PATCH /api/requests/:id/close)
export default function CloseCaseForm({ requestId, onSaved }) {
  const [form, setForm] = useState({ reason: '', referralType: 'none', referralDestination: '' })
  const [confirm, setConfirm] = useState(false)
  const { submit, pending, error, success, fieldError } = useSubmit()

  const update = (event) => setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  const needsDestination = form.referralType !== 'none'

  async function handleSubmit(event) {
    event.preventDefault()
    const saved = await submit(
      () =>
        api(`/requests/${requestId}/close`, {
          method: 'PATCH',
          body: {
            reason: form.reason,
            referralType: form.referralType,
            referralDestination: needsDestination ? form.referralDestination : undefined,
          },
        }),
      'Caso cerrado. El estudiante recibió un aviso y las citas pendientes se cancelaron.',
    )
    if (saved) onSaved()
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <ApiMessage error={error} success={success} />
      <FormField id="close-reason" label="Motivo de cierre *" error={fieldError('reason')}>
        <Textarea
          id="close-reason"
          name="reason"
          value={form.reason}
          onChange={update}
          placeholder="Ej.: se cumplieron los objetivos del acompañamiento"
        />
      </FormField>

      <div className="grid gap-x-4 sm:grid-cols-2">
        <FormField id="close-referral-type" label="Derivación realizada *" error={fieldError('referralType')}>
          <Select id="close-referral-type" name="referralType" value={form.referralType} onChange={update} options={REFERRAL_TYPE_OPTIONS} />
        </FormField>
        {needsDestination && (
          <FormField id="close-destination" label="¿A dónde se derivó? *" error={fieldError('referralDestination')}>
            <Input
              id="close-destination"
              name="referralDestination"
              value={form.referralDestination}
              onChange={update}
              placeholder="Ej.: CESFAM Santiago Centro"
            />
          </FormField>
        )}
      </div>

      <Choice checked={confirm} onChange={(event) => setConfirm(event.target.checked)}>
        Confirmo que el proceso de acompañamiento concluyó. Un caso cerrado ya no admite cambios.
      </Choice>

      <FormActions>
        <Button type="submit" variant="danger" disabled={pending || !confirm}>
          {pending ? 'Cerrando…' : 'Registrar cierre'}
        </Button>
      </FormActions>
    </form>
  )
}
