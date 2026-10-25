import Section from '../ui/Section'

const FEATURES = [
  {
    title: 'Triage y Priorización Inmediata',
    text: 'Casos urgentes reciben canalización prioritaria con el equipo de salud mental.',
  },
  {
    title: 'Autonomía para el Estudiante',
    text: 'Tú eliges el horario, la modalidad (presencial o virtual) y el tipo de orientación.',
  },
  {
    title: 'Protección Estricta de Datos',
    text: 'Tus registros clínicos están protegidos y disociados de tu historial académico (RF12).',
  },
]

const STEPS = [
  {
    title: 'Solicitas tu atención',
    text: 'Completas el formulario breve indicando tu motivo, urgencia y datos de contacto.',
  },
  {
    title: 'Asignación con el especialista',
    text: 'Te asignamos al orientador o psicólogo idóneo según tu motivo y urgencia.',
  },
  {
    title: 'Sesión confidencial',
    text: 'Acudes a tu sesión de 45 minutos presencial en el campus o por videollamada segura.',
  },
]

export default function SolutionSection() {
  return (
    <Section id="solucion" alt>
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-[2rem] font-extrabold tracking-tight text-forest-900">
            Una red pensada para cuidarte y acompañarte
          </h2>
          <p className="mb-6 text-muted">
            Nuestra plataforma unifica la solicitud de atención psicológica, talleres preventivos y derivación docente
            en un solo entorno institucional confidencial, seguro y libre de barreras.
          </p>

          <ul className="flex flex-col gap-3.5">
            {FEATURES.map(({ title, text }) => (
              <li key={title} className="flex items-start gap-3">
                <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-forest-100 text-[0.8rem] font-extrabold text-forest-800">
                  ✓
                </div>
                <div>
                  <strong className="mb-0.5 block text-[0.95rem] text-forest-900">{title}</strong>
                  <span className="text-[0.86rem] text-muted">{text}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border-[1.5px] border-border bg-page px-7 py-8">
          <h3 className="mb-5 text-[1.25rem] font-extrabold text-forest-900">¿Cómo funciona el proceso de apoyo?</h3>

          {STEPS.map(({ title, text }, index) => (
            <div
              key={title}
              className="flex items-start gap-4 border-b border-dashed border-border py-4 last:border-b-0 last:pb-0"
            >
              <div className="flex size-[38px] shrink-0 items-center justify-center rounded-sm bg-forest-800 font-extrabold text-white">
                {index + 1}
              </div>
              <div>
                <h4 className="mb-1 font-bold text-forest-900">{title}</h4>
                <p className="text-[0.86rem] text-muted">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
