import { useState } from "react";
import MesesChart from "../components/reportes/MesesChart";
import TiposChart from "../components/reportes/TiposChart";
import SideMenu from "../components/ui/SideMenu";
import {
  BUTTON_PRIMARY,
  CAPTION,
  INPUT,
  LABEL,
  NOTICE,
  PAGE_TITLE,
  TABLE,
  TD,
  TH_COL,
  TH_ROW,
} from "../components/ui/styles";

const MENU = [
  "Panorama general",
  "Tiempos de respuesta",
  "Talleres preventivos",
  "Origen de las derivaciones",
  "Exportaciones programadas",
];

const SOLICITUDES = [
  { mes: "Marzo", sede: "República", tipo: "Académico", estado: "Cerrada", dias: 2, origen: "Estudiante" },
  { mes: "Marzo", sede: "República", tipo: "Emocional", estado: "Cerrada", dias: 3, origen: "Docente" },
  { mes: "Marzo", sede: "Casona Las Condes", tipo: "Académico", estado: "Cerrada", dias: 1, origen: "Estudiante" },
  { mes: "Marzo", sede: "Bellavista", tipo: "Social", estado: "Cerrada", dias: 4, origen: "Estudiante" },
  { mes: "Marzo", sede: "Antonio Varas", tipo: "Emocional", estado: "Cerrada", dias: 2, origen: "Docente" },
  { mes: "Abril", sede: "República", tipo: "Emocional", estado: "Cerrada", dias: 2, origen: "Estudiante" },
  { mes: "Abril", sede: "República", tipo: "Económico", estado: "Cerrada", dias: 5, origen: "Estudiante" },
  { mes: "Abril", sede: "Casona Las Condes", tipo: "Emocional", estado: "Cerrada", dias: 3, origen: "Docente" },
  { mes: "Abril", sede: "Casona Las Condes", tipo: "Académico", estado: "Cerrada", dias: 2, origen: "Docente" },
  { mes: "Abril", sede: "Bellavista", tipo: "Convivencia", estado: "Cerrada", dias: 4, origen: "Estudiante" },
  { mes: "Abril", sede: "Antonio Varas", tipo: "Académico", estado: "Cerrada", dias: 3, origen: "Estudiante" },
  { mes: "Mayo", sede: "República", tipo: "Emocional", estado: "Cerrada", dias: 2, origen: "Docente" },
  { mes: "Mayo", sede: "República", tipo: "Académico", estado: "Cerrada", dias: 3, origen: "Estudiante" },
  { mes: "Mayo", sede: "República", tipo: "Social", estado: "Cerrada", dias: 4, origen: "Estudiante" },
  { mes: "Mayo", sede: "Casona Las Condes", tipo: "Emocional", estado: "Cerrada", dias: 2, origen: "Docente" },
  { mes: "Mayo", sede: "Bellavista", tipo: "Académico", estado: "Cerrada", dias: 3, origen: "Estudiante" },
  { mes: "Mayo", sede: "Antonio Varas", tipo: "Económico", estado: "Cerrada", dias: 6, origen: "Estudiante" },
  { mes: "Junio", sede: "República", tipo: "Emocional", estado: "En seguimiento", dias: 1, origen: "Docente" },
  { mes: "Junio", sede: "República", tipo: "Emocional", estado: "Cerrada", dias: 2, origen: "Estudiante" },
  { mes: "Junio", sede: "República", tipo: "Académico", estado: "En seguimiento", dias: 2, origen: "Docente" },
  { mes: "Junio", sede: "Casona Las Condes", tipo: "Académico", estado: "Cerrada", dias: 3, origen: "Estudiante" },
  { mes: "Junio", sede: "Casona Las Condes", tipo: "Social", estado: "En seguimiento", dias: 4, origen: "Estudiante" },
  { mes: "Junio", sede: "Bellavista", tipo: "Emocional", estado: "En seguimiento", dias: 2, origen: "Docente" },
  { mes: "Junio", sede: "Antonio Varas", tipo: "Convivencia", estado: "Cerrada", dias: 5, origen: "Estudiante" },
  { mes: "Julio", sede: "República", tipo: "Académico", estado: "En seguimiento", dias: 3, origen: "Estudiante" },
  { mes: "Julio", sede: "República", tipo: "Emocional", estado: "En seguimiento", dias: 2, origen: "Docente" },
  { mes: "Julio", sede: "Casona Las Condes", tipo: "Económico", estado: "En seguimiento", dias: 5, origen: "Estudiante" },
  { mes: "Julio", sede: "Bellavista", tipo: "Académico", estado: "Cerrada", dias: 3, origen: "Estudiante" },
  { mes: "Agosto", sede: "República", tipo: "Emocional", estado: "En seguimiento", dias: 1, origen: "Docente" },
  { mes: "Agosto", sede: "República", tipo: "Social", estado: "En seguimiento", dias: 3, origen: "Estudiante" },
  { mes: "Agosto", sede: "Casona Las Condes", tipo: "Emocional", estado: "En seguimiento", dias: 2, origen: "Docente" },
  { mes: "Agosto", sede: "Antonio Varas", tipo: "Académico", estado: "En seguimiento", dias: 4, origen: "Estudiante" },
];

const TIPOS = ["Emocional", "Académico", "Social", "Económico", "Convivencia"];
const MESES = ["Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto"];
const SEDES = ["República", "Casona Las Condes", "Bellavista", "Antonio Varas"];
const ESTADOS = ["En seguimiento", "Cerrada"];

const FILTROS = [
  { id: "sede", label: "Sede", todos: "todas", todosLabel: "Todas las sedes", opciones: SEDES },
  { id: "tipo", label: "Tipo de necesidad", todos: "todos", todosLabel: "Todos los tipos", opciones: TIPOS },
  { id: "estado", label: "Estado del caso", todos: "todos", todosLabel: "Todos los estados", opciones: ESTADOS },
];

function contarPor(datos, campo, valor) {
  return datos.filter((caso) => caso[campo] === valor).length;
}

function protegerConteo(cantidad) {
  if (cantidad === 0) return "0";
  if (cantidad < 5) return "Menos de 5";
  return cantidad;
}

function promedioDias(datos) {
  if (datos.length === 0) return 0;
  const suma = datos.reduce((total, caso) => total + caso.dias, 0);
  return Math.round((suma / datos.length) * 10) / 10;
}

const blockTitleClass = "mb-1.5 text-[21px] leading-tight font-semibold text-title";
const blockNoteClass = "mb-[18px] text-[13px] text-muted";

export default function ReportesPage() {
  const [filtros, setFiltros] = useState({ sede: "todas", tipo: "todos", estado: "todos" });
  const [mensaje, setMensaje] = useState("Todavía no has exportado este reporte.");

  const datos = SOLICITUDES.filter((caso) =>
    FILTROS.every(({ id, todos }) => filtros[id] === todos || caso[id] === filtros[id])
  );

  const docentes = contarPor(datos, "origen", "Docente");
  const metricas = [
    { dato: datos.length, rotulo: "Solicitudes registradas" },
    { dato: promedioDias(datos), rotulo: "Días promedio de primera respuesta" },
    { dato: contarPor(datos, "estado", "Cerrada"), rotulo: "Casos cerrados" },
    {
      dato: `${datos.length === 0 ? 0 : Math.round((docentes / datos.length) * 100)}%`,
      rotulo: "Ingresadas por derivación docente",
    },
  ];

  return (
    <div className="mx-auto grid w-full max-w-[1080px] grid-cols-[220px_1fr] items-start gap-8 px-5 pt-8 pb-12 *:min-w-0 max-[900px]:grid-cols-1 max-[900px]:gap-6 max-[560px]:px-4">
      <SideMenu label="Secciones de reportes" items={MENU} />

      <div>
        <h1 className={PAGE_TITLE}>Panorama general</h1>
        <p className="mb-6 text-muted">
          Indicadores del periodo marzo a agosto, construidos sobre las solicitudes registradas
          en la plataforma.
        </p>

        <p className={NOTICE}>
          Este reporte es agregado y no expone datos personales nominales. Los cruces con
          menos de cinco casos se muestran como rango para impedir la identificación
          indirecta de un estudiante.
        </p>

        <div className="mb-7 flex flex-wrap gap-[18px] max-[560px]:flex-col max-[560px]:gap-3.5">
          {FILTROS.map(({ id, label, todos, todosLabel, opciones }) => (
            <div key={id} className="flex-[1_1_200px] max-[560px]:flex-auto">
              <label htmlFor={`filtro-${id}`} className={LABEL}>{label}</label>
              <select
                id={`filtro-${id}`}
                value={filtros[id]}
                onChange={(event) => setFiltros({ ...filtros, [id]: event.target.value })}
                className={INPUT}
              >
                <option value={todos}>{todosLabel}</option>
                {opciones.map((opcion) => (
                  <option key={opcion} value={opcion}>{opcion}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <section
          aria-label="Indicadores del periodo"
          className="mb-10 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4"
        >
          {metricas.map(({ dato, rotulo }) => (
            <article key={rotulo} className="rounded-sm border border-border bg-card p-[18px]">
              <p className="text-[28px] leading-tight font-semibold text-forest-700">{dato}</p>
              <p className="mt-1 text-[13px] text-muted">{rotulo}</p>
            </article>
          ))}
        </section>

        <section aria-labelledby="titulo-tipos" className="mb-11">
          <h2 id="titulo-tipos" className={blockTitleClass}>Solicitudes por tipo de necesidad</h2>
          <p className={blockNoteClass}>
            Distribución del total filtrado según la clasificación asignada por el consejero.
          </p>
          <TiposChart
            items={TIPOS.map((tipo) => ({ label: tipo, cantidad: contarPor(datos, "tipo", tipo) }))}
          />
        </section>

        <section aria-labelledby="titulo-meses" className="mb-11">
          <h2 id="titulo-meses" className={blockTitleClass}>Solicitudes por mes</h2>
          <p className={blockNoteClass}>
            Volumen mensual de ingresos durante el primer semestre académico.
          </p>
          <MesesChart
            items={MESES.map((mes) => ({ label: mes, cantidad: contarPor(datos, "mes", mes) }))}
          />
        </section>

        <section aria-labelledby="titulo-sedes" className="mb-11">
          <h2 id="titulo-sedes" className={blockTitleClass}>Detalle por sede</h2>
          <p className={blockNoteClass}>Los recuentos inferiores a cinco se presentan como rango.</p>

          <div className="overflow-x-auto">
            <table className={TABLE}>
              <caption className={CAPTION}>Solicitudes, cierres y tiempo de respuesta por sede</caption>
              <thead>
                <tr>
                  {["Sede", "Solicitudes", "Cerradas", "Días promedio"].map((columna) => (
                    <th key={columna} scope="col" className={TH_COL}>{columna}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SEDES.map((sede) => {
                  const casos = datos.filter((caso) => caso.sede === sede);
                  return (
                    <tr key={sede}>
                      <th scope="row" className={TH_ROW}>{sede}</th>
                      <td className={TD}>{protegerConteo(casos.length)}</td>
                      <td className={TD}>{protegerConteo(contarPor(casos, "estado", "Cerrada"))}</td>
                      <td className={TD}>{promedioDias(casos)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() =>
                setMensaje(
                  `Se generó un reporte agregado con ${datos.length} casos. La descarga quedó registrada en la bitácora.`
                )
              }
              className={BUTTON_PRIMARY}
            >
              Exportar reporte
            </button>
          </div>

          <p className="text-[15px] leading-[1.9] break-words text-muted">{mensaje}</p>
        </section>
      </div>
    </div>
  );
}
