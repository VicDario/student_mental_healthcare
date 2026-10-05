import { Field, FormActions, RadioOption, inputClass } from '../components/ui/FormField'
import StatusBadge from '../components/ui/StatusBadge'

// Datos de ejemplo. En este taller la pantalla es solo visual;
// más adelante el historial vendrá del backend.
const HISTORIAL = [
  { folio: 'SOL-2026-0418', fecha: '12 de mayo', motivo: 'Dificultad para organizar la carga académica', estado: 'Cerrada', tono: 'neutral' },
  { folio: 'SOL-2026-0631', fecha: '28 de julio', motivo: 'Orientación sobre beneficios estudiantiles', estado: 'En seguimiento', tono: 'success' },
]

const TIPOS = ['Emocional', 'Académico', 'Social', 'Económico', 'Convivencia', 'No estoy seguro']

const URGENCIAS = [
  { id: 'urgencia-baja', value: 'Baja', label: 'Baja, puedo esperar unos días' },
  { id: 'urgencia-media', value: 'Media', label: 'Media, me gustaría respuesta esta semana' },
  { id: 'urgencia-alta', value: 'Alta', label: 'Alta, necesito hablar con alguien pronto' },
]

const PASOS = [
  'Recibes un folio y un correo de confirmación de inmediato.',
  'Un consejero revisa y clasifica tu caso dentro de 24 horas hábiles.',
  'Se te asigna un profesional dentro de 48 horas hábiles.',
  'Te contactamos por la vía que elegiste para coordinar la primera atención.',
  'Puedes seguir el estado de tu caso desde esta misma pantalla.',
]

const cardClass = 'rounded-md border-[1.5px] border-border bg-card p-6 shadow-subtle sm:p-8'

function Historial() {
  return (
    <section aria-labelledby="titulo-historial" className={cardClass}>
      <h2 id="titulo-historial" className="text-[1.35rem] font-extrabold text-forest-900">
        Mis solicitudes anteriores
      </h2>
      <p className="mt-1 mb-5 text-[0.85rem] text-muted">
        Solo tú y los profesionales autorizados pueden ver este historial.
      </p>

      <div className="overflow-x-auto rounded-sm border border-border">
        <table className="w-full min-w-[560px] border-collapse text-left text-[0.88rem]">
          <caption className="sr-only">Solicitudes que has ingresado previamente</caption>
          <thead className="bg-subtle text-[0.78rem] tracking-wide text-forest-800 uppercase">
            <tr>
              {['Folio', 'Fecha', 'Motivo', 'Estado'].map((col) => (
                <th key={col} scope="col" className="px-4 py-3 font-bold">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HISTORIAL.map((s) => (
              <tr key={s.folio} className="border-t border-border-subtle">
                <th scope="row" className="px-4 py-3 font-bold whitespace-nowrap text-forest-900">
                  {s.folio}
                </th>
                <td className="px-4 py-3 whitespace-nowrap text-muted">{s.fecha}</td>
                <td className="px-4 py-3">{s.motivo}</td>
                <td className="px-4 py-3">
                  <StatusBadge tone={s.tono}>{s.estado}</StatusBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function Formulario() {
  return (
    <form id="form-solicitud" className={`${cardClass} flex flex-col gap-8`}>
      <div className="flex flex-col gap-3">
        <div className="rounded-sm bg-subtle px-4 py-3">
          <p className="text-[0.75rem] font-bold tracking-wide text-muted uppercase">Solicitud registrada a nombre de</p>
          <p className="font-bold text-forest-900">Ana Pérez Soto · Ingeniería en Computación · Sede República</p>
        </div>
        <p className="rounded-sm border-l-4 border-forest-500 bg-forest-50 px-4 py-3 text-[0.9rem] text-forest-800">
          Tu solicitud es confidencial y solo la revisan orientadores y profesionales autorizados de la Unidad de
          Bienestar. Escribe con tus palabras, no necesitas usar términos técnicos.
        </p>
        <p className="text-[0.85rem] text-muted">Los campos marcados con asterisco son obligatorios.</p>
      </div>

      <fieldset className="flex flex-col gap-5">
        <legend className="mb-4 text-[1.2rem] font-extrabold text-forest-900">Tu solicitud</legend>

        <Field id="motivo" label="Motivo breve" required>
          <input type="text" id="motivo" name="motivo" placeholder="Dificultad para concentrarme y dormir" required className={inputClass} />
        </Field>

        <Field id="tipo" label="¿Con qué se relaciona?" required>
          <select id="tipo" name="tipo" required className={inputClass}>
            <option value="">Selecciona una opción</option>
            {TIPOS.map((tipo) => (
              <option key={tipo}>{tipo}</option>
            ))}
          </select>
        </Field>

        <Field id="descripcion" label="Descripción" required hint="0 / 600 caracteres">
          <textarea
            id="descripcion"
            name="descripcion"
            rows={6}
            maxLength={600}
            placeholder="Escribe con tus palabras qué te está pasando y desde cuándo."
            required
            className={`${inputClass} resize-y`}
          />
        </Field>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1.5 text-[0.88rem] font-bold text-forest-900">
            ¿Qué tan urgente lo sientes? <span className="text-crisis-text">*</span>
          </legend>
          {URGENCIAS.map((u, i) => (
            <RadioOption key={u.id} id={u.id} name="urgencia" value={u.value} label={u.label} required={i === 0} />
          ))}
        </fieldset>

        {/* En la versión anterior este aviso aparecía solo al marcar urgencia alta.
            En este taller es solo visual, así que se muestra siempre. */}
        <p className="rounded-sm border border-crisis-border bg-crisis-bg px-4 py-3 text-[0.88rem] text-crisis-text">
          Si marcas urgencia alta, tu solicitud entra con prioridad. Si necesitas hablar con alguien ahora mismo, no
          esperes la respuesta de la plataforma: llama a Salud Responde al <strong>600 360 7777</strong>, disponible las
          24 horas.
        </p>
      </fieldset>

      <fieldset className="flex flex-col gap-5">
        <legend className="mb-4 text-[1.2rem] font-extrabold text-forest-900">Cómo contactarte</legend>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="telefono" label="Teléfono de contacto">
            <input type="tel" id="telefono" name="telefono" placeholder="+56 9 1234 5678" className={inputClass} />
          </Field>
          <Field id="via" label="Vía preferida" required>
            <select id="via" name="via" required className={inputClass}>
              <option>Correo institucional</option>
              <option>Llamada telefónica</option>
              <option>Presencial en la sede</option>
            </select>
          </Field>
        </div>

        <Field id="horario" label="Horario en que prefieres que te contacten">
          <select id="horario" name="horario" className={inputClass}>
            <option value="Cualquier horario">Cualquier horario</option>
            <option value="Mañana">Mañana, entre 9 y 13 horas</option>
            <option value="Tarde">Tarde, entre 14 y 18 horas</option>
          </select>
        </Field>
      </fieldset>

      <label htmlFor="acepto" className="flex cursor-pointer items-start gap-3 text-[0.9rem]">
        <input type="checkbox" id="acepto" name="acepto" required className="mt-1 size-4 shrink-0 accent-forest-700" />
        <span>
          Autorizo que mi solicitud sea revisada y derivada por el equipo de bienestar estudiantil, según la pauta de uso
          responsable de datos. <span className="text-crisis-text">*</span>
        </span>
      </label>

      <FormActions submitLabel="Enviar solicitud" />

      <section aria-labelledby="titulo-resultado" className="rounded-sm border border-dashed border-forest-200 bg-forest-50 p-4">
        <h3 id="titulo-resultado" className="font-extrabold text-forest-900">
          Resumen de tu solicitud
        </h3>
        <p className="mt-1 text-[0.88rem] text-muted">Todavía no has enviado el formulario.</p>
      </section>
    </form>
  )
}

function Guia() {
  return (
    <aside className="h-fit rounded-md bg-forest-800 p-6 text-white shadow-card lg:sticky lg:top-28">
      <h2 className="mb-4 text-[1.15rem] font-extrabold">Qué ocurre después de enviar</h2>
      <ol className="flex flex-col gap-3">
        {PASOS.map((paso, i) => (
          <li key={paso} className="flex gap-3 text-[0.9rem] text-forest-100">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-forest-600 text-[0.78rem] font-bold text-white">
              {i + 1}
            </span>
            {paso}
          </li>
        ))}
      </ol>
      <p className="mt-5 border-t border-forest-700 pt-4 text-[0.85rem] text-forest-200">
        Si en algún momento necesitas ayuda inmediata, llama a Salud Responde al 600 360 7777, disponible las 24 horas.
      </p>
    </aside>
  )
}

export default function SolicitudApoyoPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-20">
      <header className="mb-6">
        <h1 className="text-[2rem] font-extrabold tracking-tight text-forest-900">Crear una solicitud de apoyo</h1>
        <p className="mt-2 max-w-[640px] text-muted">
          Cuéntanos qué necesitas. Un consejero revisará tu solicitud, la clasificará y la asignará al profesional que
          corresponda.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex min-w-0 flex-col gap-6">
          <Historial />
          <Formulario />
        </div>
        <Guia />
      </div>
    </div>
  )
}
