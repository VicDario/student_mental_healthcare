import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router";
import logo from "../../assets/logo_clean.png";

const NAV_LINKS = [
  { label: "Inicio", to: "/" },
  { label: "Servicios", href: "/#servicios" },
  { label: "Citas", to: "/agendar-cita" },
  { label: "Solicitudes", to: "/solicitud-apoyo" },
  { label: "Derivar", to: "/derivacion-docente" },
  { label: "Clasificar", to: "/clasificacion" },
  { label: "Talleres", to: "/gestionar-talleres" },
  { label: "Seguimiento", to: "/seguimiento" },
  { label: "Reportes", to: "/reportes" },
  { label: "Bitácora", to: "/bitacora" },
  { label: "Usuarios", to: "/admin-usuarios" },
  { label: "Contacto", href: "/#formulario" },
];

// Debe coincidir con el breakpoint `xl` de Tailwind, donde el menú deja de estar colapsado.
const DESKTOP_QUERY = "(min-width: 80rem)";

const linkBase =
  "inline-flex items-center whitespace-nowrap rounded-md px-3.5 py-2.5 text-[0.92rem] font-semibold transition xl:rounded-full xl:px-2.5 xl:py-[7px] xl:text-[0.78rem]";
const linkIdle =
  "text-muted hover:bg-page hover:text-forest-900 xl:hover:bg-white";
const linkActive =
  "bg-forest-800 text-white shadow-[0_2px_8px_rgba(27,67,50,0.25)]";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (!navRef.current.contains(event.target)) setOpen(false);
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    const handleChange = (event) => {
      if (event.matches) setOpen(false);
    };
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-3.5 z-50 mb-6 w-full px-3 sm:px-5">
      <nav
        ref={navRef}
        aria-label="Navegación Institucional"
        className="relative mx-auto flex max-w-310 items-center justify-between gap-2 rounded-full border-[1.5px] border-border bg-card py-1.5 pr-2.5 pl-3.5 shadow-card transition hover:border-forest-200 hover:shadow-elevated sm:gap-3 sm:py-2 sm:pr-[18px] sm:pl-[22px]"
      >
        <Link to="/" className="flex min-w-0 items-center" onClick={closeMenu}>
          <img
            src={logo}
            alt="Área Universitaria Salud Mental - Acompañamiento Terapéutico"
            className="block max-h-8 w-auto max-w-32.5 object-contain sm:h-10.5 sm:max-h-none sm:max-w-37.5"
          />
        </Link>

        <ul
          id="primaryNav"
          className={`${open ? "flex" : "hidden"} absolute inset-x-0 top-[calc(100%+10px)] flex-col gap-0.5 rounded-lg border-[1.5px] border-border bg-card p-2.5 shadow-elevated xl:static xl:flex xl:flex-row xl:items-center xl:gap-[3px] xl:rounded-full xl:border xl:border-border-subtle xl:bg-page xl:p-1 xl:shadow-none`}
        >
          {NAV_LINKS.map(({ label, to, href }) => (
            <li key={label}>
              {to ? (
                <NavLink
                  to={to}
                  end
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : linkIdle}`
                  }
                >
                  {label}
                </NavLink>
              ) : (
                <a
                  href={href}
                  onClick={closeMenu}
                  className={`${linkBase} ${linkIdle}`}
                >
                  {label}
                </a>
              )}
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          <a
            href="tel:8005552983"
            title="Línea de Crisis 24/7"
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-crisis-border bg-crisis-bg px-2.5 py-1.75 text-[0.7rem] font-bold text-crisis-text transition hover:-translate-y-px hover:bg-rose-100 sm:px-[13px] sm:text-[0.76rem]"
          >
            <span className="inline-block size-2 animate-pulse-dot rounded-full bg-red-500" />
            <span>SOS 24/7</span>
          </a>

          <Link
            to="/solicitud-apoyo"
            className="hidden items-center gap-1.5 whitespace-nowrap rounded-full bg-forest-800 px-4 py-2 text-[0.83rem] font-bold text-white transition hover:bg-forest-900 sm:inline-flex"
          >
            Solicitar Apoyo →
          </Link>

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={
              open ? "Cerrar menú de navegación" : "Abrir menú de navegación"
            }
            aria-expanded={open}
            aria-controls="primaryNav"
            className="flex size-9.5 shrink-0 cursor-pointer flex-col justify-center gap-1 rounded-full border-[1.5px] border-border bg-page transition hover:border-forest-500 hover:bg-forest-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700 xl:hidden"
          >
            <span
              className={`mx-auto block h-0.5 w-4.25 rounded-sm bg-forest-800 transition ${open ? "translate-y-1.5 rotate-45" : ""}`}
            />
            <span
              className={`mx-auto block h-0.5 w-4.25 rounded-sm bg-forest-800 transition ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`mx-auto block h-0.5 w-4.25 rounded-sm bg-forest-800 transition ${open ? "-translate-y-1.5 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </nav>
    </header>
  );
}
