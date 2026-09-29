import { Link } from "react-router";
import Section from "../ui/Section";
import SectionHeader from "../ui/SectionHeader";

const SERVICES = [
  {
    icon: "🌱",
    title: "Salud Emocional y Psicológica",
    text: "Atención terapéutica individual para afrontar ansiedad, desánimo, duelos y crisis vitales en un espacio seguro.",
    tags: ["Ansiedad", "Autoestima", "Contención"],
    link: { label: "Solicitar Atención →", to: "/solicitud-apoyo" },
  },
  {
    icon: "📖",
    title: "Acompañamiento Académico",
    text: "Estrategias personalizadas para el manejo del tiempo, métodos de estudio y superación del bloqueo por exámenes.",
    tags: ["Técnicas de Estudio", "Bloqueo", "Planificación"],
    link: { label: "Pedir Tutoría →", href: "#formulario" },
  },
  {
    icon: "🤝",
    title: "Convivencia y Adaptación",
    text: "Apoyo en habilidades sociales, integración a la vida universitaria y mediación constructiva de conflictos.",
    tags: ["Vida Universitaria", "Relaciones", "Vínculos"],
    link: { label: "Solicitar Orientación →", href: "#formulario" },
  },
  {
    icon: "💡",
    title: "Talleres Preventivos",
    text: "Actividades grupales sobre mindfulness, higiene del sueño, gestión del estrés y primeros auxilios psicológicos.",
    tags: ["Grupal", "Mindfulness", "Resiliencia"],
    link: { label: "Ver Cronograma →", href: "#atencion" },
  },
];

const linkClass =
  "inline-flex items-center gap-1 text-[0.86rem] font-bold text-forest-700 transition-all hover:gap-2 hover:text-forest-900";

export default function ServicesSection() {
  return (
    <Section id="servicios" alt>
      <SectionHeader title="Servicios diseñados para tu bienestar integral">
        Brindamos atención personalizada en cuatro dimensiones claves del
        desarrollo estudiantil.
      </SectionHeader>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(270px,100%),1fr))] gap-6">
        {SERVICES.map(({ icon, title, text, tags, link }) => (
          <article
            key={title}
            className="flex flex-col justify-between rounded-md border-[1.5px] border-border bg-card px-6 py-7 shadow-subtle transition hover:-translate-y-1 hover:border-forest-500 hover:shadow-card"
          >
            <div>
              <div className="mb-3.5 text-[2rem]">{icon}</div>
              <h3 className="mb-2 text-[1.2rem] font-extrabold text-forest-900">
                {title}
              </h3>
              <p className="mb-4 text-[0.88rem] leading-normal text-muted">
                {text}
              </p>
              <div className="mb-5 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-xs border border-border-subtle bg-page px-2 py-0.75 text-[0.72rem] font-semibold text-forest-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            {link.to ? (
              <Link to={link.to} className={linkClass}>
                {link.label}
              </Link>
            ) : (
              <a href={link.href} className={linkClass}>
                {link.label}
              </a>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}
