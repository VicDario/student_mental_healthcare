import { CLOSE_REASONS } from '../../data/cases'
import Button from '../ui/Button'
import Choice from '../ui/form/Choice'
import FormActions from '../ui/form/FormActions'
import FormField from '../ui/form/FormField'
import Select from '../ui/form/Select'
import Textarea from '../ui/form/Textarea'

export default function CloseCaseForm() {
  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <FormField id="close-reason" label="Motivo de cierre">
        <Select
          id="close-reason"
          name="close-reason"
          required
          options={CLOSE_REASONS}
          placeholder="Selecciona un motivo"
        />
      </FormField>

      <FormField
        id="close-summary"
        label="Resumen del proceso"
        hint="Este texto quedará registrado en la bitácora como parte del historial permanente del caso."
      >
        <Textarea
          id="close-summary"
          name="close-summary"
          required
          placeholder="Describe brevemente los resultados del acompañamiento y el estado del estudiante al cierre."
        />
      </FormField>

      <Choice name="close-confirm" required>
        Confirmo que el proceso de acompañamiento ha concluido y autorizo el cierre de este caso.
      </Choice>

      <FormActions>
        <Button type="submit" variant="danger">
          Registrar cierre
        </Button>
        <Button type="reset" variant="secondary">
          Cancelar
        </Button>
      </FormActions>
    </form>
  )
}
