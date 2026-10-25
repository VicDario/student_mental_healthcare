import Section from "../ui/Section";
import SectionHeader from "../ui/SectionHeader";

const SCHEDULE = [
  {
    service: "Atención Psicológica Individual",
    location: "Centro de Salud, Box 101 al 104",
    hours: "Lunes a Viernes 08:30 - 18:00",
    modality: "Presencial / Virtual",
    type: "presencial",
    response: "24 a 48 horas hábiles",
  },
  {
    service: "Orientación Psicoeducativa",
    location: "Edificio DAE, Sala de Asesorías 2",
    hours: "Martes y Jueves 09:00 - 17:00",
    modality: "Presencial",
    type: "presencial",
    response: "48 horas hábiles",
  },
  {
    service: "Línea de Crisis y Primeros Auxilios",
    location: "Unidad Central de Triage",
    hours: "24 horas / 7 días a la semana",
    modality: "Telefónica (800-555-AYUDA)",
    type: "virtual",
    response: "Inmediata (0 minutos)",
  },
  {
    service: "Talleres Grupales de Mindfulness",
    location: "Sala Multiuso Campus Central",
    hours: "Miércoles 15:00 - 16:30",
    modality: "Presencial (Cupos 20)",
    type: "presencial",
    response: "Inscripción semanal",
  },
  {
    service: "Espacio de Derivación Docente",
    location: "Portal Docente Institucional",
    hours: "Permanente en línea",
    modality: "Plataforma Web",
    type: "virtual",
    response: "24 horas hábiles",
  },
];

const BADGE_STYLES = {
  presencial: "bg-forest-100 text-forest-800",
  virtual: "bg-sky-100 text-sky-700",
};

const HEADERS = [
  "Unidad / Servicio",
  "Ubicación Física",
  "Horario Semanal",
  "Modalidad",
  "Tiempo Máx. Respuesta",
];

export default function ScheduleSection() {
  return (
    <Section id="atencion">
      <SectionHeader title="Canales de Atención en el Campus">
        Conoce los puntos de atención presencial, horarios disponibles y plazos
        de respuesta según la modalidad solicitada.
      </SectionHeader>

      <div className="overflow-x-auto rounded-md border-[1.5px] border-border bg-card shadow-subtle">
        <table
          className="w-full border-collapse text-left text-[0.9rem]"
          aria-label="Tabla de servicios y horarios de salud mental"
        >
          <thead>
            <tr>
              {HEADERS.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="bg-forest-800 px-4.5 py-3.5 text-[0.85rem] font-bold tracking-wide whitespace-nowrap text-white uppercase"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SCHEDULE.map((row) => (
              <tr
                key={row.service}
                className="border-b border-border-subtle last:border-b-0 hover:bg-forest-50"
              >
                <td className="px-4.5 py-3.5">
                  <strong>{row.service}</strong>
                </td>
                <td className="px-4.5 py-3.5">{row.location}</td>
                <td className="px-4.5 py-3.5">{row.hours}</td>
                <td className="px-4.5 py-3.5">
                  <span
                    className={`inline-block rounded-full px-2 py-0.75 text-[0.75rem] font-bold ${BADGE_STYLES[row.type]}`}
                  >
                    {row.modality}
                  </span>
                </td>
                <td className="px-4.5 py-3.5">{row.response}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
