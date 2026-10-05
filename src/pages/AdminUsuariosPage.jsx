import { Field, FormActions, RadioOption, inputClass } from '../components/ui/FormField'
import StatusBadge from '../components/ui/StatusBadge'

// Datos de ejemplo. En este taller la pantalla es solo visual;
// más adelante estas listas vendrán del backend.
const SECCIONES = [
  { label: 'Usuarios', activa: true },
  { label: 'Perfiles y permisos' },
  { label: 'Tipos de solicitud' },
  { label: 'Sedes' },
  { label: 'Unidades de apoyo' },
]

const METRICAS = [
  { valor: 6, rotulo: 'Cuentas registradas' },
  { valor: 5, rotulo: 'Cuentas activas' },
  { valor: 4, rotulo: 'Sedes cubiertas' },
  { valor: 5, rotulo: 'Perfiles definidos' },
]

const PERFILES = ['Estudiante', 'Docente', 'Consejero', 'Profesional de apoyo', 'Administrador de bienestar']
const SEDES = ['República', 'Casona Las Condes', 'Bellavista', 'Antonio Varas']
const UNIDADES = ['No aplica', 'Orientación', 'Psicología', 'Trabajo social', 'Apoyo académico']

const USUARIOS = [
  { nombre: 'Ana Pérez Soto', correo: 'ana.perez@estudiante.unab.cl', perfil: 'Estudiante', sede: 'República', activo: true },
  { nombre: 'Rodrigo Salas Vera', correo: 'rodrigo.salas@unab.cl', perfil: 'Docente', sede: 'Casona Las Condes', activo: true },
  { nombre: 'Camila Ortiz Rojas', correo: 'camila.ortiz@unab.cl', perfil: 'Consejero', sede: 'República', activo: true },
  { nombre: 'Felipe Cárdenas Lira', correo: 'felipe.cardenas@unab.cl', perfil: 'Profesional de apoyo', sede: 'Bellavista', activo: true },
  { nombre: 'Javiera Núñez Paredes', correo: 'javiera.nunez@unab.cl', perfil: 'Profesional de apoyo', sede: 'Antonio Varas', activo: false },
  { nombre: 'Carla Muñoz Tapia', correo: 'carla.munoz@unab.cl', perfil: 'Administrador de bienestar', sede: 'República', activo: true },
]

const cardClass = 'rounded-md border-[1.5px] border-border bg-card p-6 shadow-subtle sm:p-8'

function MenuLateral() {
  return (
    <aside className="h-fit min-w-0 rounded-md border-[1.5px] border-border bg-card p-4 shadow-subtle lg:sticky lg:top-28">
      <nav aria-label="Secciones de administración">
        <ul className="flex gap-1.5 overflow-x-auto lg:flex-col">
          {SECCIONES.map(({ label, activa }) => (
            <li key={label}>
              {activa ? (
                <a
                  href="#usuarios"
                  aria-current="page"
                  className="block whitespace-nowrap rounded-sm bg-forest-800 px-3.5 py-2.5 text-[0.9rem] font-bold text-white"
                >
                  {label}
                </a>
              ) : (
                <span className="block cursor-not-allowed whitespace-nowrap rounded-sm px-3.5 py-2.5 text-[0.9rem] font-semibold text-muted/60">
                  {label}
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <p className="mt-3 hidden border-t border-border-subtle pt-3 text-[0.78rem] text-muted lg:block">
        Las secciones sin enlace están en desarrollo.
      </p>
    </aside>
  )
}

function Metricas() {
  return (
    <section aria-label="Resumen de cuentas" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {METRICAS.map(({ valor, rotulo }) => (
        <article key={rotulo} className="rounded-md border-[1.5px] border-border bg-card p-5 shadow-subtle">
          <p className="text-[2rem] leading-none font-extrabold text-forest-800">{valor}</p>
          <p className="mt-2 text-[0.85rem] text-muted">{rotulo}</p>
        </article>
      ))}
    </section>
  )
}

function ListadoCuentas() {
  return (
    <section aria-labelledby="titulo-listado" className={cardClass}>
      <h2 id="titulo-listado" className="mb-5 text-[1.35rem] font-extrabold text-forest-900">
        Listado de cuentas
      </h2>

      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <Field id="buscador" label="Buscar por nombre o correo">
          <input type="search" id="buscador" placeholder="Escribe para filtrar" className={inputClass} />
        </Field>
        <Field id="filtro-perfil" label="Filtrar por perfil">
          <select id="filtro-perfil" className={inputClass}>
            <option value="todos">Todos los perfiles</option>
            {PERFILES.map((perfil) => (
              <option key={perfil}>{perfil}</option>
            ))}
          </select>
        </Field>
      </div>

      <p className="mb-3 text-[0.85rem] text-muted">Mostrando 6 de 6 cuentas.</p>

      {/* overflow-x-auto: en celular la tabla se desliza en vez de romper la página */}
      <div className="overflow-x-auto rounded-sm border border-border">
        <table className="w-full min-w-[760px] border-collapse text-left text-[0.88rem]">
          <caption className="sr-only">Cuentas registradas en la plataforma</caption>
          <thead className="bg-subtle text-[0.78rem] tracking-wide text-forest-800 uppercase">
            <tr>
              {['Nombre', 'Correo institucional', 'Perfil', 'Sede', 'Estado', 'Acción'].map((col) => (
                <th key={col} scope="col" className="px-4 py-3 font-bold">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {USUARIOS.map((u) => (
              <tr key={u.correo} className="border-t border-border-subtle transition hover:bg-forest-50/60">
                <th scope="row" className="px-4 py-3 font-bold whitespace-nowrap text-forest-900">
                  {u.nombre}
                </th>
                <td className="px-4 py-3 text-muted">{u.correo}</td>
                <td className="px-4 py-3">{u.perfil}</td>
                <td className="px-4 py-3">{u.sede}</td>
                <td className="px-4 py-3">
                  <StatusBadge tone={u.activo ? 'success' : 'neutral'}>{u.activo ? 'Activo' : 'Inactivo'}</StatusBadge>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="cursor-pointer whitespace-nowrap rounded-full border-[1.5px] border-border bg-white px-3 py-1.5 text-[0.8rem] font-bold text-forest-800 transition hover:border-forest-500 hover:bg-forest-50"
                  >
                    Cambiar estado
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function FormularioAlta() {
  return (
    <section aria-labelledby="titulo-alta" className={cardClass}>
      <h2 id="titulo-alta" className="mb-1 text-[1.35rem] font-extrabold text-forest-900">
        Registrar nueva cuenta
      </h2>
      <p className="mb-6 text-[0.85rem] text-muted">Los campos marcados con asterisco son obligatorios.</p>

      <form id="form-usuario" className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="nombre" label="Nombre completo" required>
            <input type="text" id="nombre" name="nombre" placeholder="Ana Pérez Soto" required className={inputClass} />
          </Field>
          <Field id="correo" label="Correo institucional" required>
            <input type="email" id="correo" name="correo" placeholder="ana.perez@unab.cl" required className={inputClass} />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="perfil" label="Perfil institucional" required>
            <select id="perfil" name="perfil" required className={inputClass}>
              <option value="">Selecciona un perfil</option>
              {PERFILES.map((perfil) => (
                <option key={perfil}>{perfil}</option>
              ))}
            </select>
          </Field>
          <Field id="sede" label="Sede" required>
            <select id="sede" name="sede" required className={inputClass}>
              <option value="">Selecciona una sede</option>
              {SEDES.map((sede) => (
                <option key={sede}>{sede}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field id="unidad" label="Unidad de apoyo">
          <select id="unidad" name="unidad" className={inputClass}>
            {UNIDADES.map((unidad) => (
              <option key={unidad}>{unidad}</option>
            ))}
          </select>
        </Field>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1.5 text-[0.88rem] font-bold text-forest-900">
            Estado inicial de la cuenta <span className="text-crisis-text">*</span>
          </legend>
          <RadioOption id="estado-activo" name="estado" value="Activo" label="Activo, puede iniciar sesión de inmediato" required />
          <RadioOption id="estado-inactivo" name="estado" value="Inactivo" label="Inactivo, queda registrada sin acceso" />
        </fieldset>

        <FormActions submitLabel="Registrar cuenta" />
      </form>

      <p className="mt-6 rounded-sm border border-dashed border-forest-200 bg-forest-50 p-4 text-[0.88rem] text-muted">
        Todavía no has registrado ninguna cuenta en esta sesión.
      </p>
    </section>
  )
}

export default function AdminUsuariosPage() {
  return (
    <div className="mx-auto grid max-w-[1200px] gap-6 px-5 pb-20 lg:grid-cols-[240px_1fr]">
      <MenuLateral />

      <div id="usuarios" className="flex min-w-0 flex-col gap-6">
        <header>
          <h1 className="text-[2rem] font-extrabold tracking-tight text-forest-900">Administración de usuarios</h1>
          <p className="mt-2 max-w-[640px] text-muted">
            Registro de las cuentas habilitadas en la plataforma, con su perfil institucional, sede asignada y estado de acceso.
          </p>
        </header>

        <Metricas />
        <ListadoCuentas />
        <FormularioAlta />
      </div>
    </div>
  )
}
