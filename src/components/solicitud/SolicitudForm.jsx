import { useState } from "react";
import {
  BUTTON_PRIMARY,
  BUTTON_SECONDARY,
  FIELDSET,
  INPUT,
  LABEL,
} from "../ui/styles";

const TIPOS = ["Emocional", "Académico", "Social", "Económico", "Convivencia", "No estoy seguro"];

const URGENCIAS = [
  { value: "Baja", label: "Baja, puedo esperar unos días" },
  { value: "Media", label: "Media, me gustaría respuesta esta semana" },
  { value: "Alta", label: "Alta, necesito hablar con alguien pronto" },
];

const VIAS = ["Correo institucional", "Llamada telefónica", "Presencial en la sede"];

const HORARIOS = [
  { value: "Cualquier horario", label: "Cualquier horario" },
  { value: "Mañana", label: "Mañana, entre 9 y 13 horas" },
  { value: "Tarde", label: "Tarde, entre 14 y 18 horas" },
];

const sectionClass = "mb-[26px] border-b border-border pb-1.5";
const sectionTitleClass = "mb-4 text-[17px] leading-tight font-semibold text-title";

function generarFolio() {
  const numero = Math.floor(Math.random() * 9000) + 1000;
  return `SOL-${new Date().getFullYear()}-${numero}`;
}

export default function SolicitudForm() {
  const [caracteres, setCaracteres] = useState(0);
  const [urgente, setUrgente] = useState(false);
  const [resumen, setResumen] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    const datos = Object.fromEntries(new FormData(event.target));
    setResumen({ ...datos, folio: generarFolio() });
  }

  function handleReset() {
    setCaracteres(0);
    setUrgente(false);
    setResumen(null);
  }

  const lineas = resumen && [
    ["Motivo", resumen.motivo],
    ["Se relaciona con", resumen.tipo],
    ["Descripción", resumen.descripcion],
    ["Urgencia percibida", resumen.urgencia],
    ["Teléfono", resumen.telefono],
    ["Vía preferida", resumen.via],
    ["Horario preferido", resumen.horario],
    ["Estado", "Recibida"],
  ];

  return (
    <>
      <form
        onSubmit={handleSubmit}
        onReset={handleReset}
        className="rounded-sm border border-border bg-card p-[26px] max-[560px]:p-[18px]"
      >
        <p className="mb-5 text-sm text-muted">
          Los campos marcados con asterisco son obligatorios.
        </p>

        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>Tu solicitud</h2>

          <div className="mb-[18px]">
            <label htmlFor="motivo" className={LABEL}>Motivo breve *</label>
            <input
              type="text"
              id="motivo"
              name="motivo"
              placeholder="Dificultad para concentrarme y dormir"
              required
              className={INPUT}
            />
          </div>

          <div className="mb-[18px]">
            <label htmlFor="tipo" className={LABEL}>¿Con qué se relaciona? *</label>
            <select id="tipo" name="tipo" required className={INPUT}>
              <option value="">Selecciona una opción</option>
              {TIPOS.map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          <div className="mb-[18px]">
            <label htmlFor="descripcion" className={LABEL}>Descripción *</label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows="6"
              maxLength="600"
              placeholder="Escribe con tus palabras qué te está pasando y desde cuándo."
              required
              onChange={(event) => setCaracteres(event.target.value.length)}
              className={INPUT}
            />
            <p className="mt-1.5 text-right text-[13px] text-muted">
              {caracteres} / 600 caracteres
            </p>
          </div>

          <fieldset className={FIELDSET}>
            <legend className={LABEL}>¿Qué tan urgente lo sientes? *</legend>
            {URGENCIAS.map(({ value, label }) => (
              <div key={value} className="mb-2 flex items-start gap-2">
                <input
                  type="radio"
                  id={`urgencia-${value.toLowerCase()}`}
                  name="urgencia"
                  value={value}
                  required
                  onChange={() => setUrgente(value === "Alta")}
                  className="mt-[3px] shrink-0"
                />
                <label htmlFor={`urgencia-${value.toLowerCase()}`} className="leading-snug text-muted">
                  {label}
                </label>
              </div>
            ))}
          </fieldset>

          {urgente && (
            <p className="mb-[18px] rounded-sm bg-forest-100 px-4 py-3.5 text-sm leading-normal text-forest-800">
              Marcaste urgencia alta, así que tu solicitud entra con prioridad. Si necesitas
              hablar con alguien ahora mismo, no esperes la respuesta de la plataforma:
              llama a Salud Responde al 600 360 7777, disponible las 24 horas.
            </p>
          )}
        </div>

        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>Cómo contactarte</h2>

          <div className="flex flex-wrap gap-[18px] max-[560px]:flex-col max-[560px]:gap-0">
            <div className="mb-[18px] flex-[1_1_220px] max-[560px]:flex-auto">
              <label htmlFor="telefono" className={LABEL}>Teléfono de contacto</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                placeholder="+56 9 1234 5678"
                className={INPUT}
              />
            </div>

            <div className="mb-[18px] flex-[1_1_220px] max-[560px]:flex-auto">
              <label htmlFor="via" className={LABEL}>Vía preferida *</label>
              <select id="via" name="via" required className={INPUT}>
                {VIAS.map((via) => (
                  <option key={via} value={via}>{via}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-[18px]">
            <label htmlFor="horario" className={LABEL}>
              Horario en que prefieres que te contacten
            </label>
            <select id="horario" name="horario" className={INPUT}>
              {HORARIOS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-[18px] rounded-sm border border-border bg-subtle p-3.5 text-sm">
          <input type="checkbox" id="acepto" name="acepto" required />
          <label htmlFor="acepto" className="ml-1 text-muted">
            Autorizo que mi solicitud sea revisada y derivada por el equipo de bienestar
            estudiantil, según la pauta de uso responsable de datos. *
          </label>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button type="submit" className={BUTTON_PRIMARY}>Enviar solicitud</button>
          <button type="reset" className={BUTTON_SECONDARY}>Limpiar formulario</button>
        </div>
      </form>

      <section
        aria-labelledby="titulo-resultado"
        className="mt-6 rounded-sm border border-forest-200 bg-subtle px-[22px] py-5"
      >
        <h3 id="titulo-resultado" className="mb-2 leading-tight font-semibold text-title">
          Resumen de tu solicitud
        </h3>
        <div className="text-[15px] leading-[1.9] break-words text-muted">
          {resumen ? (
            <>
              <strong className="block font-semibold text-forest-700">
                Se registró tu solicitud con el folio {resumen.folio}.
              </strong>
              {lineas.map(([rotulo, valor]) => (
                <span key={rotulo} className="block">
                  {rotulo}: {valor}
                </span>
              ))}
            </>
          ) : (
            "Todavía no has enviado el formulario."
          )}
        </div>
      </section>
    </>
  );
}
