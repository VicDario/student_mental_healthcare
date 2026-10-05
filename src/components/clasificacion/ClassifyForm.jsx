import { PRIORITIES, SUPPORT_TYPES, UNITS } from '../../data/catalogs'
import Button from '../ui/Button'
import Choice from '../ui/form/Choice'
import FormActions from '../ui/form/FormActions'
import FormField from '../ui/form/FormField'
import Select from '../ui/form/Select'
import Textarea from '../ui/form/Textarea'

export default function ClassifyForm() {
  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <FormField id="request-type" label="Tipo de apoyo" hint="Determina la unidad que recibirá el caso.">
        <Select id="request-type" name="type" required options={SUPPORT_TYPES} placeholder="Selecciona una opción" />
      </FormField>

      <fieldset className="mb-4 rounded-sm border-[1.5px] border-border p-4">
        <legend className="px-1 text-[0.8125rem] font-semibold text-forest-900">Prioridad de atención</legend>
        <div className="mt-1 flex flex-wrap gap-4">
          {PRIORITIES.map(({ value, label }) => (
            <Choice key={value} type="radio" name="priority" value={value} defaultChecked={value === 'medium'}>
              {label}
            </Choice>
          ))}
        </div>
      </fieldset>

      <FormField id="support-unit" label="Unidad de apoyo">
        <Select id="support-unit" name="unit" options={UNITS} placeholder="Sin asignar" />
      </FormField>

      <FormField
        id="classification-note"
        label="Observación"
        hint="Usa un lenguaje respetuoso y evita registrar datos sensibles que no sean necesarios para la derivación."
      >
        <Textarea id="classification-note" name="note" placeholder="Antecedentes relevantes para la derivación" />
      </FormField>

      <Choice name="restricted">Marcar como caso de acceso restringido</Choice>

      <FormActions>
        <Button type="submit">Guardar clasificación</Button>
        <Button type="reset" variant="secondary">
          Cancelar
        </Button>
      </FormActions>
    </form>
  )
}
