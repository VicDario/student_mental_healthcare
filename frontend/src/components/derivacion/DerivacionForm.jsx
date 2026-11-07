import { useState } from "react";
import { api } from "../../api/client";
import { useSubmit } from "../../hooks/useSubmit";
import ApiMessage from "../ui/ApiMessage";
import { BUTTON_PRIMARY, BUTTON_SECONDARY, FIELDSET, INPUT, LABEL } from "../ui/styles";

const URGENCIAS = [
  { id: "urgencia-baja", value: "low", label: "Baja, conviene hacer seguimiento" },
  { id: "urgencia-media", value: "medium", label: "Media, requiere contacto esta semana" },
  { id: "urgencia-alta", value: "high", label: "Alta, requiere contacto prioritario" },
];

const CONTACTOS = [
  { id: "aviso-si", value: "true", label: "Sí, está en conocimiento" },
  { id: "aviso-no", value: "false", label: "No, prefiero que lo contacte la unidad" },
];

const EMPTY = { studentEmail: "", course: "", observedSituation: "", perceivedUrgency: "", studentInformed: "" };

const sectionClass = "mb-[26px] border-b border-border pb-1.5";
const sectionTitleClass = "mb-4 text-[17px] leading-tight font-semibold text-title";
const fieldClass = "mb-[18px]";
const errorClass = "mt-1.5 text-[13px] font-medium text-crisis-text";

function FieldError({ message }) {
  return message ? <p className={errorClass}>{message}</p> : null;
}

function RadioGroup({ legend, name, options, value, onChange, error }) {
  return (
    <fieldset className={FIELDSET}>
      <legend className={LABEL}>{legend}</legend>
      {options.map((option) => (
        <div key={option.id} className="mb-2 flex items-start gap-2">
          <input
            type="radio"
            id={option.id}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
            className="mt-[3px] shrink-0"
          />
          <label htmlFor={option.id} className="leading-snug text-muted">{option.label}</label>
        </div>
      ))}
      <FieldError message={error} />
    </fieldset>
  );
}

// Deriva a un estudiante (POST /api/requests/referral)
export default function DerivacionForm({ onCreated }) {
  const [form, setForm] = useState(EMPTY);
  const [pauta, setPauta] = useState(false);
  const { submit, pending, error, success, fieldError } = useSubmit();

  const update = (event) => setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  async function handleSubmit(event) {
    event.preventDefault();
    const created = await submit(
      () =>
        api("/requests/referral", {
          method: "POST",
          body: {
            studentEmail: form.studentEmail,
            course: form.course || undefined,
            observedSituation: form.observedSituation,
            perceivedUrgency: form.perceivedUrgency || undefined,
            studentInformed: form.studentInformed === "" ? undefined : form.studentInformed === "true",
          },
        }),
      "Se registró la derivación. Un consejero revisará el caso y el estudiante recibirá un aviso respetuoso.",
    );
    if (created) {
      setForm(EMPTY);
      setPauta(false);
      onCreated?.(created);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-sm border border-border bg-card p-[26px] max-[560px]:p-[18px]">
      <ApiMessage error={error} success={success} />
      <p className="mb-5 text-sm text-muted">Los campos marcados con asterisco son obligatorios.</p>

      <div className={sectionClass}>
        <h2 className={sectionTitleClass}>Datos del estudiante</h2>

        <div className={fieldClass}>
          <label htmlFor="studentEmail" className={LABEL}>Correo institucional del estudiante *</label>
          <input
            type="email"
            id="studentEmail"
            name="studentEmail"
            value={form.studentEmail}
            onChange={update}
            placeholder="estudiante@test.cl"
            className={INPUT}
          />
          <FieldError message={fieldError("studentEmail")} />
        </div>

        <div className={fieldClass}>
          <label htmlFor="course" className={LABEL}>Asignatura en que se observó la situación</label>
          <input type="text" id="course" name="course" value={form.course} onChange={update} placeholder="Programación Web" className={INPUT} />
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className={sectionTitleClass}>Situación observada</h2>

        <div className={fieldClass}>
          <label htmlFor="observedSituation" className={LABEL}>Descripción de lo observado *</label>
          <textarea
            id="observedSituation"
            name="observedSituation"
            rows="6"
            maxLength="600"
            value={form.observedSituation}
            onChange={update}
            placeholder="Ejemplo: ha faltado a cinco sesiones seguidas, no entregó las dos últimas evaluaciones y en clases se le nota decaído."
            className={INPUT}
          />
          <p className="mt-1.5 text-right text-[13px] text-muted">{form.observedSituation.length} / 600 caracteres</p>
          <FieldError message={fieldError("observedSituation")} />
        </div>

        <RadioGroup
          legend="Urgencia percibida *"
          name="perceivedUrgency"
          options={URGENCIAS}
          value={form.perceivedUrgency}
          onChange={update}
          error={fieldError("perceivedUrgency")}
        />
      </div>

      <div className={sectionClass}>
        <h2 className={sectionTitleClass}>Contacto previo</h2>
        <RadioGroup
          legend="¿Conversaste con el estudiante sobre esta derivación? *"
          name="studentInformed"
          options={CONTACTOS}
          value={form.studentInformed}
          onChange={update}
          error={fieldError("studentInformed")}
        />
      </div>

      <div className="mb-[18px] rounded-sm border border-border bg-subtle p-3.5 text-sm">
        <input type="checkbox" id="pauta" checked={pauta} onChange={(event) => setPauta(event.target.checked)} />
        <label htmlFor="pauta" className="ml-1 text-muted">
          Declaro que la información entregada es veraz, que conozco la pauta de derivación responsable y que no
          compartiré estos antecedentes con terceros. *
        </label>
      </div>

      <div className="flex flex-wrap gap-2.5">
        <button type="submit" disabled={pending || !pauta} className={`${BUTTON_PRIMARY} disabled:cursor-not-allowed disabled:opacity-60`}>
          {pending ? "Enviando…" : "Enviar derivación"}
        </button>
        <button type="button" onClick={() => setForm(EMPTY)} className={BUTTON_SECONDARY}>Limpiar formulario</button>
      </div>
    </form>
  );
}
