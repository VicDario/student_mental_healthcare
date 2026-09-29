import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import Section from "../ui/Section";
import SectionHeader from "../ui/SectionHeader";

const MOTIVOS = [
  "Ansiedad y Estrés ante Exámenes",
  "Tristeza o Desánimo Continuo",
  "Dificultades de Adaptación",
  "Problemas Familiares o Personales",
  "Orientación Vocacional",
];
const URGENCIAS = [
  "Bajo (Preventivo)",
  "Moderado (Afecta mi estudio)",
  "Alto (Necesito atención pronta)",
];
const MODALIDADES = [
  "Presencial (Campus Central)",
  "Virtual (Videollamada Segura)",
];

const INITIAL_FORM = {
  nombre: "",
  rut: "",
  carrera: "",
  correo: "",
  motivo: "",
  urgencia: URGENCIAS[1],
  modalidad: MODALIDADES[0],
  mensaje: "",
};

const inputClass =
  "w-full rounded-sm border-[1.5px] border-border bg-white px-3.5 py-[11px] text-[0.92rem] text-body transition focus:border-border-active focus:shadow-[0_0_0_3px_var(--color-forest-100)] focus:outline-none";

function Field({ id, label, required = false, children }) {
  return (
    <div className="mb-4.5">
      <label
        htmlFor={id}
        className="mb-1.5 block text-[0.88rem] font-bold text-forest-900"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function ResultCard({ result }) {
  const rows = [
    ["Código de Folio", result.folio],
    ["Estudiante", result.nombre],
    ["RUT", result.rut || "No informado"],
    ["Carrera", result.carrera],
    ["Correo", result.correo],
    ["Motivo Informado", result.motivo],
    ["Nivel de Urgencia", result.urgencia],
    ["Modalidad", result.modalidad],
    ["Observaciones", result.mensaje || "Sin observaciones adicionales."],
  ];

  return (
    <div className="animate-slide-in rounded-lg border-[1.5px] border-border bg-card px-7 py-8 shadow-card">
      <span className="mb-3 inline-block rounded-full bg-forest-100 px-2.5 py-0.75 text-[0.74rem] font-bold text-forest-800 uppercase">
        ✓ Solicitud Registrada con Éxito
      </span>
      <h3 className="mb-2 text-[1.3rem] font-extrabold text-forest-900">
        Comprobante de Orientación
      </h3>
      <p className="mb-5 text-[0.9rem] text-muted">
        Hemos recibido tus datos correctamente. Se ha generado un registro
        confidencial para canalizar tu caso.
      </p>

      <dl className="mb-6 flex flex-col gap-3 rounded-md border border-border-subtle bg-page p-4.5">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex justify-between gap-4 border-b border-dashed border-border pb-2 text-[0.88rem] last:border-b-0 last:pb-0"
          >
            <dt className="text-muted">{label}:</dt>
            <dd className="text-right font-bold text-forest-900">{value}</dd>
          </div>
        ))}
      </dl>

      <Link
        to="/solicitud-apoyo"
        className="block rounded-full bg-forest-700 p-3.25 text-center font-bold text-white transition hover:bg-forest-800"
      >
        Ir al Panel de Solicitud y Asignación Institucional →
      </Link>
    </div>
  );
}

export default function OrientationSection() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [result, setResult] = useState(null);
  const resultRef = useRef(null);

  useEffect(() => {
    if (result)
      resultRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
  }, [result]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, value.trim()]),
    );
    const folio = `SMU-${Math.floor(100000 + Math.random() * 900000)}`;
    setResult({ ...trimmed, folio });
  };

  return (
    <Section id="formulario" alt>
      <SectionHeader title="Solicita Orientación Inicial">
        Si no estás seguro de qué tipo de sesión necesitas, completa este
        formulario breve. Nuestro equipo revisará tus antecedentes con estricta
        confidencialidad.
      </SectionHeader>

      <div
        className={`mx-auto transition-[max-width] duration-400 ${result ? "grid max-w-300 items-start gap-10 lg:grid-cols-2" : "max-w-170"}`}
      >
        <div className="rounded-lg border-[1.5px] border-border bg-card px-7 py-8 shadow-card">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-3.5 sm:grid-cols-2">
              <Field id="nombre" label="Nombre Completo" required>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  placeholder="Ej: Valeria Gómez"
                  value={form.nombre}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Field>
              <Field id="rut" label="RUT / Identificador">
                <input
                  id="rut"
                  name="rut"
                  type="text"
                  placeholder="Ej: 20.123.456-7"
                  value={form.rut}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2">
              <Field id="carrera" label="Carrera / Facultad" required>
                <input
                  id="carrera"
                  name="carrera"
                  type="text"
                  required
                  placeholder="Ej: Ingeniería Comercial"
                  value={form.carrera}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Field>
              <Field id="correo" label="Correo Institucional" required>
                <input
                  id="correo"
                  name="correo"
                  type="email"
                  required
                  placeholder="valeria.gomez@universidad.cl"
                  value={form.correo}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2">
              <Field id="motivo" label="Motivo Principal" required>
                <select
                  id="motivo"
                  name="motivo"
                  required
                  value={form.motivo}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="" disabled>
                    Selecciona un motivo...
                  </option>
                  {MOTIVOS.map((motivo) => (
                    <option key={motivo} value={motivo}>
                      {motivo}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="urgencia" label="Nivel de Malestar Percibido" required>
                <select
                  id="urgencia"
                  name="urgencia"
                  required
                  value={form.urgencia}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {URGENCIAS.map((urgencia) => (
                    <option key={urgencia} value={urgencia}>
                      {urgencia}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field id="modalidad" label="Modalidad de Preferencia" required>
              <select
                id="modalidad"
                name="modalidad"
                required
                value={form.modalidad}
                onChange={handleChange}
                className={inputClass}
              >
                {MODALIDADES.map((modalidad) => (
                  <option key={modalidad} value={modalidad}>
                    {modalidad}
                  </option>
                ))}
              </select>
            </Field>

            <Field id="mensaje" label="Cuéntanos brevemente cómo te sientes">
              <textarea
                id="mensaje"
                name="mensaje"
                rows={3}
                placeholder="Escribe lo que desees compartir. Toda la información es confidencial..."
                value={form.mensaje}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>

            <button
              type="submit"
              className="w-full cursor-pointer rounded-full bg-forest-800 p-3.5 font-bold text-white transition hover:bg-forest-900"
            >
              Enviar Solicitud de Orientación →
            </button>
          </form>
        </div>

        {result && (
          <div ref={resultRef}>
            <ResultCard result={result} />
          </div>
        )}
      </div>
    </Section>
  );
}
