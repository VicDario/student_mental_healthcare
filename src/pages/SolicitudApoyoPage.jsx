import SolicitudForm from "../components/solicitud/SolicitudForm";
import {
  BADGE_OFF,
  BADGE_ON,
  CAPTION,
  NOTICE,
  PAGE_TITLE,
  TABLE,
  TD,
  TH_COL,
  TH_ROW,
} from "../components/ui/styles";

const HISTORIAL = [
  {
    folio: "SOL-2026-0418",
    fecha: "12 de mayo",
    motivo: "Dificultad para organizar la carga académica",
    estado: "Cerrada",
  },
  {
    folio: "SOL-2026-0631",
    fecha: "28 de julio",
    motivo: "Orientación sobre beneficios estudiantiles",
    estado: "En seguimiento",
  },
];

const PASOS = [
  "Recibes un folio y un correo de confirmación de inmediato.",
  "Un consejero revisa y clasifica tu caso dentro de 24 horas hábiles.",
  "Se te asigna un profesional dentro de 48 horas hábiles.",
  "Te contactamos por la vía que elegiste para coordinar la primera atención.",
  "Puedes seguir el estado de tu caso desde esta misma pantalla.",
];

export default function SolicitudApoyoPage() {
  return (
    <div className="mx-auto grid w-full max-w-[1080px] grid-cols-[1fr_300px] items-start gap-8 px-5 pt-8 pb-12 *:min-w-0 max-[900px]:grid-cols-1 max-[900px]:gap-6 max-[560px]:px-4">
      <div>
        <h1 className={PAGE_TITLE}>Crear una solicitud de apoyo</h1>
        <p className="mb-6 text-muted">
          Cuéntanos qué necesitas. Un consejero revisará tu solicitud, la clasificará y la
          asignará al profesional que corresponda.
        </p>

        <section aria-labelledby="titulo-historial" className="mb-8">
          <h2 id="titulo-historial" className="mb-1.5 text-[19px] leading-tight font-semibold text-title">
            Mis solicitudes anteriores
          </h2>
          <p className="mb-3.5 text-[13px] text-muted">
            Solo tú y los profesionales autorizados pueden ver este historial.
          </p>

          <div className="overflow-x-auto">
            <table className={`${TABLE} max-[560px]:min-w-[520px]`}>
              <caption className={CAPTION}>Solicitudes que has ingresado previamente</caption>
              <thead>
                <tr>
                  <th scope="col" className={TH_COL}>Folio</th>
                  <th scope="col" className={TH_COL}>Fecha</th>
                  <th scope="col" className={TH_COL}>Motivo</th>
                  <th scope="col" className={TH_COL}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {HISTORIAL.map(({ folio, fecha, motivo, estado }) => (
                  <tr key={folio}>
                    <th scope="row" className={TH_ROW}>{folio}</th>
                    <td className={TD}>{fecha}</td>
                    <td className={TD}>{motivo}</td>
                    <td className={TD}>
                      <span className={estado === "Cerrada" ? BADGE_OFF : BADGE_ON}>{estado}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="mb-6 rounded-sm border border-border bg-subtle px-[18px] py-4">
          <p className="mb-1 text-[13px] text-muted">Solicitud registrada a nombre de</p>
          <p className="text-[15px] font-medium text-body">
            Ana Pérez Soto &middot; Ingeniería en Computación &middot; Sede República
          </p>
        </div>

        <p className={NOTICE}>
          Tu solicitud es confidencial y solo la revisan orientadores y profesionales
          autorizados de la Unidad de Bienestar. Escribe con tus palabras, no necesitas
          usar términos técnicos.
        </p>

        <SolicitudForm />
      </div>

      <aside className="rounded-sm border border-border bg-page p-5 max-[900px]:-order-1">
        <h2 className="mb-3 leading-tight font-semibold text-title">Qué ocurre después de enviar</h2>
        <ol className="list-decimal pl-[18px]">
          {PASOS.map((paso) => (
            <li key={paso} className="mb-2.5 text-sm leading-[1.55] text-muted">{paso}</li>
          ))}
        </ol>
        <p className="mt-4 border-t border-border pt-3.5 text-[13px] leading-[1.55] text-muted">
          Si en algún momento necesitas ayuda inmediata, llama a Salud Responde al
          600 360 7777, disponible las 24 horas.
        </p>
      </aside>
    </div>
  );
}
