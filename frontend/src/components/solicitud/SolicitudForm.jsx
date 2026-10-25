import { SUPPORT_TYPES } from '../../data/catalogs'
import { CONTACT_CHANNELS, CONTACT_TIMES, URGENCY_OPTIONS } from '../../data/supportRequests'
import Button from '../ui/Button'
import Choice from '../ui/form/Choice'
import FormActions from '../ui/form/FormActions'
import FormField from '../ui/form/FormField'
import Input from '../ui/form/Input'
import Select from '../ui/form/Select'
import Textarea from '../ui/form/Textarea'

const sectionTitleClass = 'mb-4 text-[1rem] font-bold text-title'

export default function SolicitudForm() {
  return (
    <form>
      <p className="mb-5 text-[0.8125rem] text-muted">Los campos marcados con asterisco son obligatorios.</p>

      <h3 className={sectionTitleClass}>Tu solicitud</h3>

      <FormField id="request-reason" label="Motivo breve *">
        <Input id="request-reason" name="reason" placeholder="Dificultad para concentrarme y dormir" required />
      </FormField>

      <FormField id="request-type" label="¿Con qué se relaciona? *">
        <Select id="request-type" name="type" options={SUPPORT_TYPES} placeholder="Selecciona una opción" required />
      </FormField>

      <FormField id="request-description" label="Descripción *" hint="0 / 600 caracteres">
        <Textarea
          id="request-description"
          name="description"
          rows={6}
          maxLength={600}
          placeholder="Escribe con tus palabras qué te está pasando y desde cuándo."
          required
        />
      </FormField>

      <fieldset className="mb-4 rounded-sm border-[1.5px] border-border p-4">
        <legend className="px-1 text-[0.8125rem] font-semibold text-forest-900">¿Qué tan urgente lo sientes? *</legend>
        <div className="mt-1 flex flex-col gap-2">
          {URGENCY_OPTIONS.map((option, index) => (
            <Choice key={option.value} type="radio" name="urgency" value={option.value} required={index === 0}>
              {option.label}
            </Choice>
          ))}
        </div>
      </fieldset>

      {/* En el Taller 1 este aviso aparecía solo al marcar urgencia alta.
          Esta versión es solo visual, así que se muestra siempre. */}
      <p className="mb-6 rounded-sm border border-crisis-border bg-crisis-bg px-4 py-3 text-[0.875rem] text-crisis-text">
        Si marcas urgencia alta, tu solicitud entra con prioridad. Si necesitas hablar con alguien ahora mismo, no esperes
        la respuesta de la plataforma: llama a Salud Responde al <strong>600 360 7777</strong>, disponible las 24 horas.
      </p>

      <h3 className={sectionTitleClass}>Cómo contactarte</h3>

      <div className="grid gap-x-4 sm:grid-cols-2">
        <FormField id="request-phone" label="Teléfono de contacto">
          <Input id="request-phone" name="phone" type="tel" placeholder="+56 9 1234 5678" />
        </FormField>
        <FormField id="request-channel" label="Vía preferida *">
          <Select id="request-channel" name="channel" options={CONTACT_CHANNELS} required />
        </FormField>
      </div>

      <FormField id="request-time" label="Horario en que prefieres que te contacten">
        <Select id="request-time" name="time" options={CONTACT_TIMES} />
      </FormField>

      <Choice name="consent" required>
        Autorizo que mi solicitud sea revisada y derivada por el equipo de bienestar estudiantil, según la pauta de uso
        responsable de datos. *
      </Choice>

      <FormActions>
        <Button type="submit">Enviar solicitud</Button>
        <Button type="reset" variant="secondary">
          Limpiar formulario
        </Button>
      </FormActions>
    </form>
  )
}
