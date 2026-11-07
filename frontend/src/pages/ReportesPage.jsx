import { useState } from "react";
import { toQuery } from "../api/client";
import MesesChart from "../components/reportes/MesesChart";
import TiposChart from "../components/reportes/TiposChart";
import LoadState from "../components/ui/LoadState";
import { CAPTION, INPUT, LABEL, NOTICE, PAGE_TITLE, TABLE, TD, TH_COL, TH_ROW } from "../components/ui/styles";
import { useApi } from "../hooks/useApi";
import { statusLabel, toOptions, urgencyLabel } from "../utils/labels";

// Los cruces con menos de 5 casos se muestran como rango para no identificar a nadie
function protegerConteo(cantidad) {
  if (cantidad === 0) return "0";
  if (cantidad < 5) return "Menos de 5";
  return cantidad;
}

const horas = (valor) => (valor === null ? "Sin datos" : valor < 48 ? `${valor} h` : `${Math.round((valor / 24) * 10) / 10} días`);

const mesLabel = (mes) =>
  new Date(`${mes}-01T12:00:00`).toLocaleDateString("es-CL", { month: "short", year: "2-digit" });

const blockTitleClass = "mb-1.5 text-[21px] leading-tight font-semibold text-title";
const blockNoteClass = "mb-[18px] text-[13px] text-muted";

export default function ReportesPage() {
  const [filtros, setFiltros] = useState({ campus: "", from: "", to: "" });
  const campuses = useApi("/catalogs?type=campus");
  const report = useApi(`/reports/summary${toQuery(filtros)}`);
  const datos = report.data;

  const cambiar = (event) => setFiltros({ ...filtros, [event.target.name]: event.target.value });

  const metricas = datos && [
    { dato: datos.totalRequests, rotulo: "Solicitudes registradas" },
    { dato: horas(datos.responseTimes.toAssignment.averageHours), rotulo: "Tiempo promedio hasta la asignación" },
    { dato: datos.byStatus.closed, rotulo: "Casos cerrados" },
    {
      dato: `${datos.totalRequests ? Math.round((datos.byOrigin.referral / datos.totalRequests) * 100) : 0}%`,
      rotulo: "Ingresadas por derivación docente",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1080px] px-5 pt-8 pb-12 max-[560px]:px-4">
      <h1 className={PAGE_TITLE}>Reportes institucionales</h1>
      <p className="mb-6 text-muted">Indicadores construidos sobre las solicitudes y talleres registrados en la plataforma.</p>

      <p className={NOTICE}>
        Este reporte es agregado y no expone datos personales: solo trae conteos y promedios, sin nombres, correos ni
        códigos de solicitud. Los cruces con menos de cinco casos se muestran como rango.
      </p>

      <div className="mb-7 flex flex-wrap gap-[18px] max-[560px]:flex-col max-[560px]:gap-3.5">
        <div className="flex-[1_1_200px]">
          <label htmlFor="filtro-campus" className={LABEL}>Sede</label>
          <select id="filtro-campus" name="campus" value={filtros.campus} onChange={cambiar} className={INPUT}>
            <option value="">Todas las sedes</option>
            {toOptions(campuses.data ?? []).map((opcion) => (
              <option key={opcion.value} value={opcion.value}>{opcion.label}</option>
            ))}
          </select>
        </div>
        <div className="flex-[1_1_160px]">
          <label htmlFor="filtro-from" className={LABEL}>Desde</label>
          <input id="filtro-from" name="from" type="date" value={filtros.from} onChange={cambiar} className={INPUT} />
        </div>
        <div className="flex-[1_1_160px]">
          <label htmlFor="filtro-to" className={LABEL}>Hasta</label>
          <input id="filtro-to" name="to" type="date" value={filtros.to} onChange={cambiar} className={INPUT} />
        </div>
      </div>

      <LoadState loading={report.loading} error={report.error} empty={!datos}>
        {datos && (
          <>
            <section aria-label="Indicadores del periodo" className="mb-10 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
              {metricas.map(({ dato, rotulo }) => (
                <article key={rotulo} className="rounded-sm border border-border bg-card p-[18px]">
                  <p className="text-[28px] leading-tight font-semibold text-forest-700">{dato}</p>
                  <p className="mt-1 text-[13px] text-muted">{rotulo}</p>
                </article>
              ))}
            </section>

            <section aria-labelledby="titulo-tipos" className="mb-11">
              <h2 id="titulo-tipos" className={blockTitleClass}>Solicitudes por tipo de apoyo</h2>
              <p className={blockNoteClass}>Según la clasificación del consejero. "Sin clasificar" son solicitudes que aún no se revisan.</p>
              <TiposChart items={datos.byType.map((item) => ({ label: item.type === "sin_dato" ? "Sin clasificar" : item.type, cantidad: item.count }))} />
            </section>

            <section aria-labelledby="titulo-meses" className="mb-11">
              <h2 id="titulo-meses" className={blockTitleClass}>Solicitudes por mes</h2>
              <p className={blockNoteClass}>Volumen mensual de ingresos.</p>
              {datos.byMonth.length ? (
                <MesesChart items={datos.byMonth.map((item) => ({ label: mesLabel(item.month), cantidad: item.count }))} />
              ) : (
                <p className="text-sm text-muted">Sin solicitudes en el periodo.</p>
              )}
            </section>

            <section aria-labelledby="titulo-estado" className="mb-11 grid gap-6 md:grid-cols-2">
              <div>
                <h2 id="titulo-estado" className={blockTitleClass}>Estado de los casos</h2>
                <TiposChart items={Object.entries(datos.byStatus).map(([estado, cantidad]) => ({ label: statusLabel(estado), cantidad }))} />
              </div>
              <div>
                <h2 className={blockTitleClass}>Urgencia percibida</h2>
                <TiposChart items={Object.entries(datos.byUrgency).map(([nivel, cantidad]) => ({ label: urgencyLabel(nivel), cantidad }))} />
              </div>
            </section>

            <section aria-labelledby="titulo-sedes" className="mb-11">
              <h2 id="titulo-sedes" className={blockTitleClass}>Detalle por sede</h2>
              <p className={blockNoteClass}>Los recuentos inferiores a cinco se presentan como rango.</p>
              <div className="overflow-x-auto">
                <table className={TABLE}>
                  <caption className={CAPTION}>Solicitudes por sede</caption>
                  <thead>
                    <tr>
                      {["Sede", "Solicitudes"].map((columna) => (
                        <th key={columna} scope="col" className={TH_COL}>{columna}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {datos.byCampus.map((item) => (
                      <tr key={item.campus}>
                        <th scope="row" className={TH_ROW}>{item.campus === "sin_dato" ? "Sin sede" : item.campus}</th>
                        <td className={TD}>{protegerConteo(item.count)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section aria-labelledby="titulo-tiempos" className="mb-11 grid gap-4 md:grid-cols-2">
              <h2 id="titulo-tiempos" className={`${blockTitleClass} md:col-span-2`}>Tiempos de respuesta</h2>
              {[
                ["Desde la recepción hasta la asignación", datos.responseTimes.toAssignment],
                ["Desde la recepción hasta el cierre", datos.responseTimes.toClosure],
              ].map(([rotulo, tiempo]) => (
                <article key={rotulo} className="rounded-sm border border-border bg-card p-[18px]">
                  <p className="text-[24px] font-semibold text-forest-700">{horas(tiempo.averageHours)}</p>
                  <p className="mt-1 text-[13px] text-muted">
                    {rotulo} · {tiempo.cases} casos
                  </p>
                </article>
              ))}
            </section>

            <section aria-labelledby="titulo-talleres">
              <h2 id="titulo-talleres" className={blockTitleClass}>Participación en talleres</h2>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
                {[
                  [datos.workshops.workshops, "Talleres en el periodo"],
                  [datos.workshops.enrollments.enrolled + datos.workshops.enrollments.attended, "Inscripciones activas"],
                  [datos.workshops.enrollments.attended, "Asistencias"],
                  [datos.workshops.attendanceRate === null ? "—" : `${datos.workshops.attendanceRate}%`, "Tasa de asistencia"],
                ].map(([dato, rotulo]) => (
                  <article key={rotulo} className="rounded-sm border border-border bg-card p-[18px]">
                    <p className="text-[24px] font-semibold text-forest-700">{dato}</p>
                    <p className="mt-1 text-[13px] text-muted">{rotulo}</p>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
      </LoadState>
    </div>
  );
}
