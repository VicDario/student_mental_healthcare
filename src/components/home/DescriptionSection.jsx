import Section from "../ui/Section";
import SectionHeader from "../ui/SectionHeader";

const MISSION_CARDS = [
  {
    icon: "🎯",
    title: "Propósito y Misión",
    text: "Promover el bienestar biopsicosocial de la comunidad estudiantil, reduciendo factores de riesgo como el estrés crónico, el aislamiento y la deserción académica a través de intervenciones oportunas y profesionales.",
  },
  {
    icon: "👥",
    title: "Público Objetivo",
    text: "Estudiantes regulares de pregrado y posgrado de todas las carreras y sedes, además de docentes y tutores académicos que participan como agentes activos de detección y derivación responsable (CU3).",
  },
  {
    icon: "⚖️",
    title: "Garantías y Principios",
    text: "Atención 100% gratuita, acceso equitativo, sin barreras burocráticas y con secreto profesional estricto: ningún antecedente clínico se mezcla con el expediente académico del alumno (RF12).",
  },
];

export default function DescriptionSection() {
  return (
    <Section id="descripcion">
      <SectionHeader title="Descripción del Proyecto Institucional">
        La <strong>Red de Apoyo y Salud Mental Universitaria</strong> es un
        programa oficial impulsado por la Dirección de Asuntos Estudiantiles
        (DAE) para garantizar que todo estudiante cuente con acompañamiento
        psicológico, contención emocional y orientación preventiva durante su
        trayectoria académica.
      </SectionHeader>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-6">
        {MISSION_CARDS.map(({ icon, title, text }) => (
          <div
            key={title}
            className="rounded-md border-[1.5px] border-border bg-card p-6.5 shadow-subtle"
          >
            <div className="mb-3 text-[1.8rem]">{icon}</div>
            <h3 className="mb-2 text-[1.15rem] font-extrabold text-forest-900">
              {title}
            </h3>
            <p className="text-[0.9rem] leading-normal text-muted">{text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
