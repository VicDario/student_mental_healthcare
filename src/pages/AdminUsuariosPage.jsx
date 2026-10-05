import { useState } from "react";
import UsuarioForm from "../components/admin-usuarios/UsuarioForm";
import SideMenu from "../components/ui/SideMenu";
import {
  BADGE_OFF,
  BADGE_ON,
  CAPTION,
  INPUT,
  LABEL,
  PAGE_TITLE,
  TABLE,
  TD,
  TH_COL,
  TH_ROW,
} from "../components/ui/styles";

const MENU = ["Usuarios", "Perfiles y permisos", "Tipos de solicitud", "Sedes", "Unidades de apoyo"];

const PERFILES = ["Estudiante", "Docente", "Consejero", "Profesional de apoyo", "Administrador de bienestar"];

const USUARIOS = [
  { nombre: "Ana Pérez Soto", correo: "ana.perez@estudiante.unab.cl", perfil: "Estudiante", sede: "República", estado: "Activo" },
  { nombre: "Rodrigo Salas Vera", correo: "rodrigo.salas@unab.cl", perfil: "Docente", sede: "Casona Las Condes", estado: "Activo" },
  { nombre: "Camila Ortiz Rojas", correo: "camila.ortiz@unab.cl", perfil: "Consejero", sede: "República", estado: "Activo" },
  { nombre: "Felipe Cárdenas Lira", correo: "felipe.cardenas@unab.cl", perfil: "Profesional de apoyo", sede: "Bellavista", estado: "Activo" },
  { nombre: "Javiera Núñez Paredes", correo: "javiera.nunez@unab.cl", perfil: "Profesional de apoyo", sede: "Antonio Varas", estado: "Inactivo" },
  { nombre: "Carla Muñoz Tapia", correo: "carla.munoz@unab.cl", perfil: "Administrador de bienestar", sede: "República", estado: "Activo" },
];

const blockTitleClass = "mb-4 text-[21px] leading-tight font-semibold text-title";

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState(USUARIOS);
  const [busqueda, setBusqueda] = useState("");
  const [perfil, setPerfil] = useState("todos");

  const texto = busqueda.toLowerCase();
  const visibles = usuarios.filter(
    (usuario) =>
      (usuario.nombre.toLowerCase().includes(texto) || usuario.correo.toLowerCase().includes(texto)) &&
      (perfil === "todos" || usuario.perfil === perfil)
  );

  const metricas = [
    { dato: usuarios.length, rotulo: "Cuentas registradas" },
    { dato: usuarios.filter((usuario) => usuario.estado === "Activo").length, rotulo: "Cuentas activas" },
    { dato: 4, rotulo: "Sedes cubiertas" },
    { dato: 5, rotulo: "Perfiles definidos" },
  ];

  function cambiarEstado(elegido) {
    setUsuarios(
      usuarios.map((usuario) =>
        usuario === elegido
          ? { ...usuario, estado: usuario.estado === "Activo" ? "Inactivo" : "Activo" }
          : usuario
      )
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-[1080px] grid-cols-[220px_1fr] items-start gap-8 px-5 pt-8 pb-12 *:min-w-0 max-[900px]:grid-cols-1 max-[900px]:gap-6 max-[560px]:px-4">
      <SideMenu label="Secciones de administración" items={MENU} />

      <div>
        <h1 className={PAGE_TITLE}>Administración de usuarios</h1>
        <p className="mb-7 text-muted">
          Registro de las cuentas habilitadas en la plataforma, con su perfil institucional,
          sede asignada y estado de acceso.
        </p>

        <section
          aria-label="Resumen de cuentas"
          className="mb-10 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4"
        >
          {metricas.map(({ dato, rotulo }) => (
            <article key={rotulo} className="rounded-sm border border-border bg-card p-[18px]">
              <p className="text-[28px] leading-tight font-semibold text-forest-700">{dato}</p>
              <p className="mt-1 text-[13px] text-muted">{rotulo}</p>
            </article>
          ))}
        </section>

        <section aria-labelledby="titulo-listado" className="mb-11">
          <h2 id="titulo-listado" className={blockTitleClass}>Listado de cuentas</h2>

          <div className="mb-2 flex flex-wrap gap-[18px]">
            <div className="mb-2.5 flex-[1_1_240px]">
              <label htmlFor="buscador" className={LABEL}>Buscar por nombre o correo</label>
              <input
                type="search"
                id="buscador"
                placeholder="Escribe para filtrar"
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                className={INPUT}
              />
            </div>
            <div className="mb-2.5 flex-[1_1_240px]">
              <label htmlFor="filtro-perfil" className={LABEL}>Filtrar por perfil</label>
              <select
                id="filtro-perfil"
                value={perfil}
                onChange={(event) => setPerfil(event.target.value)}
                className={INPUT}
              >
                <option value="todos">Todos los perfiles</option>
                {PERFILES.map((opcion) => (
                  <option key={opcion} value={opcion}>{opcion}</option>
                ))}
              </select>
            </div>
          </div>

          <p className="mb-3 text-[13px] text-muted">
            Mostrando {visibles.length} de {usuarios.length} cuentas.
          </p>

          <div className="overflow-x-auto">
            <table className={TABLE}>
              <caption className={CAPTION}>Cuentas registradas en la plataforma</caption>
              <thead>
                <tr>
                  {["Nombre", "Correo institucional", "Perfil", "Sede", "Estado", "Acción"].map((columna) => (
                    <th key={columna} scope="col" className={TH_COL}>{columna}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibles.map((usuario, index) => (
                  <tr key={index}>
                    <th scope="row" className={TH_ROW}>{usuario.nombre}</th>
                    <td className={TD}>{usuario.correo}</td>
                    <td className={TD}>{usuario.perfil}</td>
                    <td className={TD}>{usuario.sede}</td>
                    <td className={TD}>
                      <span className={usuario.estado === "Activo" ? BADGE_ON : BADGE_OFF}>
                        {usuario.estado}
                      </span>
                    </td>
                    <td className={TD}>
                      <button
                        type="button"
                        onClick={() => cambiarEstado(usuario)}
                        className="cursor-pointer rounded-sm border border-forest-200 bg-card px-3 py-1.5 text-[13px] whitespace-nowrap text-forest-700 hover:border-forest-700 hover:bg-forest-100 max-[560px]:w-full"
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

        <section aria-labelledby="titulo-alta" className="mb-11">
          <h2 id="titulo-alta" className={blockTitleClass}>Registrar nueva cuenta</h2>
          <UsuarioForm
            perfiles={PERFILES}
            onAdd={(usuario) => setUsuarios([...usuarios, usuario])}
          />
        </section>
      </div>
    </div>
  );
}
