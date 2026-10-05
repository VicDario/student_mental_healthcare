import { useState } from "react";
import {
  BUTTON_PRIMARY,
  BUTTON_SECONDARY,
  FIELDSET,
  INPUT,
  LABEL,
} from "../ui/styles";

const SEDES = ["República", "Casona Las Condes", "Bellavista", "Antonio Varas"];

const UNIDADES = ["No aplica", "Orientación", "Psicología", "Trabajo social", "Apoyo académico"];

const ESTADOS = [
  { value: "Activo", label: "Activo, puede iniciar sesión de inmediato" },
  { value: "Inactivo", label: "Inactivo, queda registrada sin acceso" },
];

const halfFieldClass = "mb-[18px] flex-[1_1_220px]";

export default function UsuarioForm({ perfiles, onAdd }) {
  const [mensaje, setMensaje] = useState(
    "Todavía no has registrado ninguna cuenta en esta sesión."
  );

  function handleSubmit(event) {
    event.preventDefault();
    const usuario = Object.fromEntries(new FormData(event.target));
    onAdd(usuario);
    setMensaje(
      `Se registró la cuenta de ${usuario.nombre} con perfil ${usuario.perfil} en la sede ${usuario.sede}, unidad ${usuario.unidad}.`
    );
    event.target.reset();
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="rounded-sm border border-border bg-card p-[26px] max-[560px]:p-[18px]"
      >
        <p className="mb-5 text-sm text-muted">
          Los campos marcados con asterisco son obligatorios.
        </p>

        <div className="flex flex-wrap gap-[18px]">
          <div className={halfFieldClass}>
            <label htmlFor="nombre" className={LABEL}>Nombre completo *</label>
            <input type="text" id="nombre" name="nombre" placeholder="Ana Pérez Soto" required className={INPUT} />
          </div>
          <div className={halfFieldClass}>
            <label htmlFor="correo" className={LABEL}>Correo institucional *</label>
            <input type="email" id="correo" name="correo" placeholder="ana.perez@unab.cl" required className={INPUT} />
          </div>
        </div>

        <div className="flex flex-wrap gap-[18px]">
          <div className={halfFieldClass}>
            <label htmlFor="perfil" className={LABEL}>Perfil institucional *</label>
            <select id="perfil" name="perfil" required className={INPUT}>
              <option value="">Selecciona un perfil</option>
              {perfiles.map((perfil) => (
                <option key={perfil} value={perfil}>{perfil}</option>
              ))}
            </select>
          </div>
          <div className={halfFieldClass}>
            <label htmlFor="sede" className={LABEL}>Sede *</label>
            <select id="sede" name="sede" required className={INPUT}>
              <option value="">Selecciona una sede</option>
              {SEDES.map((sede) => (
                <option key={sede} value={sede}>{sede}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-[18px]">
          <label htmlFor="unidad" className={LABEL}>Unidad de apoyo</label>
          <select id="unidad" name="unidad" className={INPUT}>
            {UNIDADES.map((unidad) => (
              <option key={unidad} value={unidad}>{unidad}</option>
            ))}
          </select>
        </div>

        <fieldset className={FIELDSET}>
          <legend className={LABEL}>Estado inicial de la cuenta *</legend>
          {ESTADOS.map(({ value, label }) => (
            <div key={value} className="mb-1.5">
              <input
                type="radio"
                id={`estado-${value.toLowerCase()}`}
                name="estado"
                value={value}
                required
              />
              <label htmlFor={`estado-${value.toLowerCase()}`} className="ml-1 text-muted">
                {label}
              </label>
            </div>
          ))}
        </fieldset>

        <div className="flex flex-wrap gap-2.5">
          <button type="submit" className={BUTTON_PRIMARY}>Registrar cuenta</button>
          <button type="reset" className={BUTTON_SECONDARY}>Limpiar formulario</button>
        </div>
      </form>

      <p className="text-[15px] leading-[1.9] break-words text-muted">{mensaje}</p>
    </>
  );
}
