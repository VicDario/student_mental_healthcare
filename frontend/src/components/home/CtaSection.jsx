import ButtonLink from "../ui/ButtonLink";
import Section from "../ui/Section";

export default function CtaSection() {
  return (
    <Section id="accion">
      <div className="rounded-lg bg-linear-135 from-forest-900 to-forest-800 px-9 py-12 text-center text-white shadow-card">
        <h2 className="mb-3 text-[2.2rem] font-extrabold tracking-tight">
          ¿Listo para priorizar tu bienestar universitario?
        </h2>
        <p className="mx-auto mb-7 max-w-160 text-[1.05rem] text-forest-100">
          No tienes que esperar a que el malestar aumente. Ingresa tu solicitud
          de apoyo hoy o contáctate con la unidad de bienestar de tu sede.
        </p>
        <ButtonLink to="/solicitud-apoyo" variant="white">
          📝 Ingresar Solicitud de Apoyo
        </ButtonLink>
      </div>
    </Section>
  );
}
