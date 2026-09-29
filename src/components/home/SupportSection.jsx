import students from "../../assets/students_showing_thumbs_up_at.png";
import ButtonLink from "../ui/ButtonLink";
import Section from "../ui/Section";

const SUPPORT_POINTS = [
  {
    icon: "🤝",
    title: "Acompañamiento Oportuno sin Juicios",
    text: "Un espacio cálido y libre de presiones académicas donde dialogar sobre dudas vocacionales, ansiedad por certámenes o duelos personales con total respeto.",
  },
  {
    icon: "🌱",
    title: "Prevenir antes de Llegar al Límite",
    text: "Consultar ante las primeras señales de agotamiento evita la deserción estudiantil, cuadros severos y el deterioro de tu salud física y mental.",
  },
  {
    icon: "🛡️",
    title: "Respaldados por una Red Profesional",
    text: "Psicólogos clínicos, orientadores y docentes derivadores coordinados para proteger tu tranquilidad desde tu ingreso hasta tu graduación.",
  },
];

export default function SupportSection() {
  return (
    <Section id="apoyo">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr]">
        <div className="relative rounded-lg border-[1.5px] border-border bg-card p-4 shadow-card">
          <img
            src={students}
            alt="Grupo de estudiantes universitarios acompañados y sonriendo"
            className="block h-95 w-full rounded-md object-cover"
          />
          <div className="absolute inset-x-8 bottom-7 flex items-center gap-2.5 rounded-full border border-white/15 bg-forest-900/90 px-[18px] py-3 text-[0.86rem] font-bold text-white shadow-card backdrop-blur-sm">
            <span className="text-[1.2rem]">💚</span>
            <span>
              Comunidad Universitaria • Más de 1,450 estudiantes acompañados
            </span>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-[2.2rem] leading-tight font-extrabold tracking-tight text-forest-900">
            Pedir ayuda es un acto de valentía:{" "}
            <span className="text-forest-700">Estamos contigo</span>
          </h2>
          <p className="mb-6 text-[1.05rem]">
            Nadie debería enfrentar la presión universitaria en soledad.
            Reconocer que necesitas una pausa o un espacio para ordenar tus
            emociones no es debilidad; es la decisión más responsable para
            cuidar tu bienestar y tu futuro profesional.
          </p>

          <blockquote className="relative mb-6 rounded-md border-[1.5px] border-forest-200 bg-linear-135 from-white to-forest-50 py-4 pr-5 pl-12.5 text-[0.94rem] leading-relaxed font-medium text-forest-900 shadow-[0_4px_16px_-2px_rgba(27,67,50,0.05)]">
            <span
              aria-hidden="true"
              className="absolute top-1.5 left-4.5 font-serif text-[2.6rem] leading-none text-forest-500"
            >
              &ldquo;
            </span>
            No tienes que poder con todo tú solo/a. Compartir lo que sientes
            alivia el peso de inmediato y abre caminos que no se ven en el
            aislamiento.
          </blockquote>

          <div className="mb-7 flex flex-col gap-4">
            {SUPPORT_POINTS.map(({ icon, title, text }) => (
              <div key={title} className="flex items-start gap-3.5">
                <div className="mt-0.5 flex size-8.5 shrink-0 items-center justify-center rounded-full bg-forest-100">
                  {icon}
                </div>
                <div>
                  <strong className="mb-0.5 block text-[0.98rem] text-forest-900">
                    {title}
                  </strong>
                  <span className="text-[0.88rem] leading-normal text-muted">
                    {text}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3.5">
            <ButtonLink to="/solicitud-apoyo">
              📝 Ingresar Solicitud de Apoyo →
            </ButtonLink>
            <ButtonLink href="#formulario" variant="secondary">
              Enviar Consulta Breve
            </ButtonLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
