import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { HOME_BY_ROLE } from "../../auth/roleHome";
import { roleLabel } from "../../utils/labels";
import ButtonLink from "../ui/ButtonLink";
import Section from "../ui/Section";
import SectionHeader from "../ui/SectionHeader";
import SolicitudForm from "../solicitud/SolicitudForm";

const cardClass =
  "rounded-lg border-[1.5px] border-border bg-card px-7 py-8 shadow-card";

// Comprobante con los datos reales que devolvió la API (POST /api/requests)
function ResultCard({ request }) {
  return (
    <div className={`animate-slide-in ${cardClass}`}>
      <span className="mb-3 inline-block rounded-full bg-forest-100 px-2.5 py-0.75 text-[0.74rem] font-bold text-forest-800 uppercase">
        ✓ Solicitud registrada
      </span>
      <h3 className="mb-2 text-[1.3rem] font-extrabold text-forest-900">
        Código {request.code}
      </h3>
      <p className="mb-6 text-[0.9rem] text-muted">
        Un consejero revisará tu solicitud. Te avisaremos en tu panel cada vez
        que cambie de estado.
      </p>
      <ButtonLink to="/solicitud-apoyo" className="w-full">
        Ver mis solicitudes y avisos →
      </ButtonLink>
    </div>
  );
}

// La solicitud siempre pertenece a un estudiante con sesión iniciada:
// sin sesión se invita a ingresar o crear cuenta; otros perfiles van a su panel.
function Gate({ user }) {
  if (user) {
    return (
      <div className={`${cardClass} text-center`}>
        <p className="mb-5 text-[0.95rem] text-muted">
          Este formulario es para estudiantes. Ingresaste como{" "}
          <strong className="text-forest-900">{roleLabel(user.role)}</strong>.
        </p>
        <ButtonLink to={HOME_BY_ROLE[user.role] ?? "/"}>Ir a mi panel →</ButtonLink>
      </div>
    );
  }

  return (
    <div className={`${cardClass} text-center`}>
      <p className="mb-5 text-[0.95rem] text-muted">
        Para cuidar tu confidencialidad, las solicitudes se envían desde tu
        cuenta de estudiante. Así solo tú y el equipo autorizado pueden verlas.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <ButtonLink to="/login">Iniciar sesión</ButtonLink>
        <ButtonLink to="/registro" variant="secondary">
          Crear cuenta
        </ButtonLink>
      </div>
    </div>
  );
}

export default function OrientationSection() {
  const { user, checking } = useAuth();
  const [created, setCreated] = useState(null);
  const resultRef = useRef(null);
  const isStudent = user?.role === "student";

  useEffect(() => {
    if (created)
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [created]);

  return (
    <Section id="formulario" alt>
      <SectionHeader title="Solicita Orientación Inicial">
        Si no estás seguro de qué tipo de sesión necesitas, completa este
        formulario breve. Nuestro equipo revisará tus antecedentes con estricta
        confidencialidad.
      </SectionHeader>

      <div
        className={`mx-auto transition-[max-width] duration-400 ${created ? "grid max-w-300 items-start gap-10 lg:grid-cols-2" : "max-w-170"}`}
      >
        {checking ? null : isStudent ? (
          <div className={cardClass}>
            <SolicitudForm defaultEmail={user.email} onCreated={setCreated} />
          </div>
        ) : (
          <Gate user={user} />
        )}

        {created && (
          <div ref={resultRef}>
            <ResultCard request={created} />
          </div>
        )}
      </div>
    </Section>
  );
}
