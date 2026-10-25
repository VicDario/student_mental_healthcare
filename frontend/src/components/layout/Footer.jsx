import { Link } from "react-router";

const NAVIGATION_LINKS = [
  { label: "Inicio", href: "/#inicio" },
  { label: "Descripción", href: "/#descripcion" },
  { label: "El Problema", href: "/#problema" },
  { label: "Estamos Contigo", href: "/#apoyo" },
  { label: "Nuestra Solución", href: "/#solucion" },
  { label: "Servicios", href: "/#servicios" },
  { label: "Horarios", href: "/#atencion" },
];

const SERVICE_LINKS = [
  { label: "Solicitud de Apoyo", to: "/solicitud-apoyo" },
  { label: "Solicitar Orientación", href: "/#formulario" },
  { label: "Talleres Preventivos", to: "/gestionar-talleres" },
  { label: "Clasificar Solicitudes", to: "/clasificacion" },
  { label: "Seguimiento de Casos", to: "/seguimiento" },
];

const linkClass =
  "text-[0.86rem] text-forest-200 transition-colors hover:text-white";

function FooterColumn({ title, children }) {
  return (
    <div>
      <h4 className="mb-3.5 text-[0.92rem] font-bold tracking-wide text-white uppercase">
        {title}
      </h4>
      {children}
    </div>
  );
}

function FooterLinks({ links }) {
  return (
    <ul className="flex flex-col gap-2">
      {links.map(({ label, to, href }) => (
        <li key={label}>
          {to ? (
            <Link to={to} className={linkClass}>
              {label}
            </Link>
          ) : (
            <a href={href} className={linkClass}>
              {label}
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  return (
    <footer className="mt-12 bg-forest-900 pt-11 pb-6 text-white sm:mt-20 sm:pt-15 sm:pb-7">
      <div className="mx-auto w-full max-w-300 px-5">
        <div className="mb-8 grid grid-cols-1 gap-7 sm:mb-12 sm:gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <h3 className="mb-2 text-[1.15rem] font-extrabold">
              Red de Apoyo y Salud Mental Universitaria
            </h3>
            <p className="mb-4 text-[0.86rem] leading-normal text-forest-200">
              Plataforma institucional de acompañamiento y contención
              psicológica para estudiantes de pregrado y posgrado.
            </p>
            <p className="text-[0.8rem] text-forest-400">
              📍 Edificio de Servicios Estudiantiles, Piso 2, Campus Central.
            </p>
          </div>

          <FooterColumn title="Navegación">
            <FooterLinks links={NAVIGATION_LINKS} />
          </FooterColumn>

          <FooterColumn title="Servicios">
            <FooterLinks links={SERVICE_LINKS} />
          </FooterColumn>

          <FooterColumn title="Emergencias 24/7">
            <p className="mb-2 text-[0.84rem] text-forest-200">
              Si tú o alguien que conoces necesita ayuda inmediata:
            </p>
            <a
              href="tel:8005552983"
              className="mb-2 block text-[1.1rem] font-bold text-red-500"
            >
              800-555-AYUDA
            </a>
            <span className="text-[0.78rem] text-forest-400">
              Línea gratuita, anónima y permanente.
            </span>
          </FooterColumn>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/12 pt-6 text-[0.8rem] text-forest-400">
          <p>
            © {new Date().getFullYear()} Red de Salud Mental Universitaria.
            Todos los derechos reservados.
          </p>
          <p>
            Cumplimiento estricto con protocolos de confidencialidad y ética
            profesional.
          </p>
        </div>
      </div>
    </footer>
  );
}
