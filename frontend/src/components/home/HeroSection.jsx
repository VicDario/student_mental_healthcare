import psicologa from "../../assets/psicologa_2.webp";
import ButtonLink from "../ui/ButtonLink";

const TRUST_ITEMS = [
  { icon: "🔒", label: "100% Confidencial" },
  { icon: "🎓", label: "Servicio Gratuito" },
  { icon: "⚡", label: "Sin Esperas Burocráticas" },
];

export default function HeroSection() {
  return (
    <section id="inicio" className="scroll-mt-28 pt-[60px] pb-20">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <h1 className="mb-[18px] text-[1.85rem] leading-tight font-extrabold tracking-tighter text-forest-900 sm:text-[2.2rem] lg:text-[2.8rem]">
            Tu salud mental es tan importante como{" "}
            <span className="text-forest-700">tu carrera</span>.
          </h1>
          <p className="mb-7 text-[1.1rem] text-muted">
            Un espacio universitario seguro, confidencial y gratuito diseñado
            para acompañarte ante el estrés de exámenes, ansiedad, problemas de
            adaptación o cualquier momento difícil.
          </p>

          <div className="mb-8 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap sm:items-center">
            <ButtonLink to="/solicitud-apoyo">
              📝 Solicitar Apoyo Estudiantil
            </ButtonLink>
            <ButtonLink href="#formulario" variant="secondary">
              Orientación Rápida
            </ButtonLink>
          </div>

          <div className="flex flex-wrap gap-5">
            {TRUST_ITEMS.map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 text-[0.85rem] font-semibold text-forest-700"
              >
                <span>{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border-[1.5px] border-border bg-card p-6 shadow-card">
          <div className="mb-4 overflow-hidden rounded-md border border-border">
            <img
              src={psicologa}
              alt="Dra. Carolina Muñoz - Psicóloga Clínica"
              className="block h-62.5 w-full object-cover object-[center_20%]"
            />
          </div>
          <h2 className="text-[1.25rem] font-extrabold text-forest-900">
            Dra. Carolina Muñoz
          </h2>
          <p className="mb-3.5 text-[0.82rem] text-muted">
            Psicóloga Clínica • Especialista en Adaptación Universitaria
          </p>
          <p className="mb-4 rounded-sm border border-forest-200 bg-linear-135 from-white to-forest-50 px-3.5 py-3 text-[0.86rem] italic">
            "Pedir ayuda no es señal de debilidad; es una decisión valiente para
            recuperar tu tranquilidad y continuar tu formación."
          </p>
          <ButtonLink to="/solicitud-apoyo" variant="soft" className="w-full">
            Solicitar Acompañamiento →
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
