import { useState } from "react";
import {
  BUTTON_PRIMARY,
  BUTTON_SECONDARY,
  FIELDSET,
  INPUT,
  LABEL,
} from "../ui/styles";

const SEDES = ["República", "Casona Las Condes", "Bellavista", "Antonio Varas"];

const TIPOS = ["Emocional", "Académico", "Social", "Económico", "Convivencia", "Otro"];

const URGENCIAS = [
  { id: "urgencia-baja", value: "Baja", label: "Baja, conviene hacer seguimiento" },
  { id: "urgencia-media", value: "Media", label: "Media, requiere contacto esta semana" },
  { id: "urgencia-alta", value: "Alta", label: "Alta, requiere contacto prioritario" },
];

const CONTACTOS = [
  { id: "aviso-si", value: "Sí, está en conocimiento" },
  { id: "aviso-no", value: "No, prefiero que lo contacte la unidad" },
  { id: "aviso-imposible", value: "No fue posible contactarlo" },
];

const VIAS = ["Correo institucional", "Llamada telefónica", "Notificación en la plataforma"];

const sectionClass = "mb-[26px] border-b border-border pb-1.5";
const sectionTitleClass = "mb-4 text-[17px] leading-tight font-semibold text-title";
const fieldClass = "mb-[18px]";
const halfFieldClass = "mb-[18px] flex-[1_1_220px] max-[560px]:flex-auto";
const rowClass = "flex flex-wrap gap-[18px] max-[560px]:flex-col max-[560px]:gap-0";

function RadioGroup({ legend, name, options }) {
  return (
    <fieldset className={FIELDSET}>
      <legend className={LABEL}>{legend}</legend>
      {options.map(({ id, value, label }) => (
        <div key={id} className="mb-2 flex items-start gap-2">
          <input type="radio" id={id} name={name} value={value} required className="mt-[3px] shrink-0" />
          <label htmlFor={id} className="leading-snug text-muted">{label ?? value}</label>
        </div>
      ))}
    </fieldset>
  );
}

export default function DerivacionForm() {
  const [caracteres, setCaracteres] = useState(0);
  const [resumen, setResumen] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    setResumen(Object.fromEntries(new FormData(event.target)));
  }

  function handleReset() {
    setCaracteres(0);
    setResumen(null);
  }

  const lineas = resumen && [
    ["Estudiante", resumen.estudiante],
    ["Correo", resumen.correo],
    ["Carrera", resumen.carrera],
    ["Sede", resumen.sede],
    ["Asignatura", resumen.asignatura],
    ["Tipo de necesidad observada", resumen.tipo],
    ["Descripción", resumen.descripcion],
    ["Urgencia percibida", resumen.urgencia],
    ["Contacto previo con el estudiante", resumen.conversado],
    ["Confirmación por", resumen.via],
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
          <h2 className={sectionTitleClass}>Datos del estudiante</h2>

          <div className={rowClass}>
            <div className={halfFieldClass}>
              <label htmlFor="estudiante" className={LABEL}>Nombre completo *</label>
              <input type="text" id="estudiante" name="estudiante" placeholder="Ana Pérez Soto" required className={INPUT} />
            </div>
            <div className={halfFieldClass}>
              <label htmlFor="correo" className={LABEL}>Correo institucional *</label>
              <input
                type="email"
                id="correo"
                name="correo"
                placeholder="ana.perez@estudiante.unab.cl"
                required
                className={INPUT}
              />
            </div>
          </div>

          <div className={rowClass}>
            <div className={halfFieldClass}>
              <label htmlFor="carrera" className={LABEL}>Carrera</label>
              <input type="text" id="carrera" name="carrera" placeholder="Ingeniería en Computación" className={INPUT} />
            </div>
            <div className={halfFieldClass}>
              <label htmlFor="sede" className={LABEL}>Sede *</label>
              <select id="sede" name="sede" required className={INPUT}>
                <option value="">Selecciona una sede</option>
                {SEDES.map((sede) => (
                  <option key={sede} value={sede}>{sede}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={fieldClass}>
            <label htmlFor="asignatura" className={LABEL}>
              Asignatura en que se observó la situación *
            </label>
            <input type="text" id="asignatura" name="asignatura" placeholder="Programación Web" required className={INPUT} />
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>Situación observada</h2>

          <div className={fieldClass}>
            <label htmlFor="tipo" className={LABEL}>Tipo de necesidad observada *</label>
            <select id="tipo" name="tipo" required className={INPUT}>
              <option value="">Selecciona una opción</option>
              {TIPOS.map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          <div className={fieldClass}>
            <label htmlFor="descripcion" className={LABEL}>Descripción de lo observado *</label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows="6"
              maxLength="600"
              placeholder="Ejemplo: ha faltado a cinco sesiones seguidas, no entregó las dos últimas evaluaciones y en clases se le nota decaído."
              required
              onChange={(event) => setCaracteres(event.target.value.length)}
              className={INPUT}
            />
            <p className="mt-1.5 text-right text-[13px] text-muted">
              {caracteres} / 600 caracteres
            </p>
          </div>

          <RadioGroup legend="Urgencia percibida *" name="urgencia" options={URGENCIAS} />
        </div>

        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>Contacto previo</h2>

          <RadioGroup
            legend="¿Conversaste con el estudiante sobre esta derivación? *"
            name="conversado"
            options={CONTACTOS}
          />

          <div className={fieldClass}>
            <label htmlFor="via" className={LABEL}>
              Vía por la que prefieres recibir la confirmación
            </label>
            <select id="via" name="via" className={INPUT}>
              {VIAS.map((via) => (
                <option key={via} value={via}>{via}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-[18px] rounded-sm border border-border bg-subtle p-3.5 text-sm">
          <input type="checkbox" id="pauta" name="pauta" required />
          <label htmlFor="pauta" className="ml-1 text-muted">
            Declaro que la información entregada es veraz, que conozco la pauta de derivación
            responsable y que no compartiré estos antecedentes con terceros. *
          </label>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button type="submit" className={BUTTON_PRIMARY}>Enviar derivación</button>
          <button type="reset" className={BUTTON_SECONDARY}>Limpiar formulario</button>
        </div>
      </form>

      <section
        aria-labelledby="titulo-resultado"
        className="mt-6 rounded-sm border border-forest-200 bg-subtle px-[22px] py-5"
      >
        <h3 id="titulo-resultado" className="mb-2 leading-tight font-semibold text-title">
          Resumen de la derivación
        </h3>
        <div className="text-[15px] leading-[1.9] break-words text-muted">
          {resumen ? (
            <>
              <strong className="block font-semibold text-forest-700">Se registró la derivación.</strong>
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
