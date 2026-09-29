import Section from "../ui/Section";
import SectionHeader from "../ui/SectionHeader";

const PROBLEMS = [
  {
    icon: "📚",
    title: "Sobrecarga y Bloqueo Académico",
    text: "Ansiedad intensa ante certámenes, entregas finales y sensación de agotamiento continuo que dificulta la concentración y el descanso.",
  },
  {
    icon: "🌧️",
    title: "Ansiedad y Tristeza Persistente",
    text: "Cambios de ánimo, desmotivación o angustia recurrente que afectan tu rutina diaria y tus relaciones personales y familiares.",
  },
  {
    icon: "🧭",
    title: "Adaptación y Soledad",
    text: "Dificultad para integrarse a la vida universitaria, lejanía de las familias en estudiantes de otras regiones o incertidumbre vocacional.",
  },
  {
    icon: "⏳",
    title: "Canales Desorganizados",
    text: "Falta de un sistema seguro donde pedir apoyo a tiempo sin trámites engorrosos ni exposición de la intimidad del estudiante.",
  },
];

export default function ProblemSection() {
  return (
    <Section id="problema" alt>
      <SectionHeader title="Reconocer lo que sientes es el primer paso">
        La vida universitaria trae exigencias intensas. Muchos estudiantes
        enfrentan situaciones complejas en soledad por falta de canales claros o
        temor al estigma.
      </SectionHeader>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-6">
        {PROBLEMS.map(({ icon, title, text }) => (
          <article
            key={title}
            className="rounded-md border-[1.5px] border-border bg-card px-6 py-7 shadow-subtle transition hover:-translate-y-0.75 hover:border-forest-500 hover:shadow-card"
          >
            <div className="mb-4 flex size-12 items-center justify-center rounded-sm border border-forest-200 bg-forest-50 text-[1.4rem]">
              {icon}
            </div>
            <h3 className="mb-2 text-[1.15rem] font-extrabold text-forest-900">
              {title}
            </h3>
            <p className="text-[0.9rem] text-muted">{text}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
