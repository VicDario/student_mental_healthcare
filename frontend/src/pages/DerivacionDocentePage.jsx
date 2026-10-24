import DerivacionForm from "../components/derivacion/DerivacionForm";
import { NOTICE, PAGE_TITLE } from "../components/ui/styles";

const PAUTA = [
  "Registra hechos observables: asistencia, entregas, cambios en la participación.",
  "No formules diagnósticos ni uses etiquetas clínicas. Esa evaluación corresponde al profesional.",
  "Informa al estudiante cuando sea posible, explicando que la derivación busca apoyarlo.",
  "Usa lenguaje respetuoso y no estigmatizante en la descripción.",
  "No compartas los antecedentes con otros docentes ni con el curso.",
];

export default function DerivacionDocentePage() {
  return (
    <div className="mx-auto grid w-full max-w-[1080px] grid-cols-[1fr_300px] items-start gap-8 px-5 pt-8 pb-12 *:min-w-0 max-[900px]:grid-cols-1 max-[900px]:gap-6 max-[560px]:px-4">
      <div>
        <h1 className={PAGE_TITLE}>Derivar a un estudiante</h1>
        <p className="mb-6 text-muted">
          Este formulario registra una derivación responsable hacia la Unidad de Bienestar.
          Un consejero revisará el caso, lo clasificará y lo asignará a un profesional habilitado.
        </p>

        <div className="mb-6 rounded-sm border border-border bg-subtle px-[18px] py-4">
          <p className="mb-1 text-[13px] text-muted">Derivación registrada a nombre de</p>
          <p className="text-[15px] font-medium text-body">
            Rodrigo Salas Vera &middot; Escuela de Ingeniería &middot; Sede Casona Las Condes
          </p>
        </div>

        <p className={NOTICE}>
          Describe hechos observables en el aula y evita formular diagnósticos. La información
          queda restringida a los perfiles autorizados de la Unidad de Bienestar y su acceso
          queda registrado en la bitácora del sistema.
        </p>

        <DerivacionForm />
      </div>

      <aside className="rounded-sm border border-border bg-page p-5 max-[900px]:-order-1">
        <h2 className="mb-3 leading-tight font-semibold text-title">Pauta de derivación responsable</h2>
        <ol className="list-decimal pl-[18px]">
          {PAUTA.map((paso) => (
            <li key={paso} className="mb-2.5 text-sm leading-[1.55] text-muted">{paso}</li>
          ))}
        </ol>
        <p className="mt-4 border-t border-border pt-3.5 text-[13px] leading-[1.55] text-muted">
          Si la situación implica riesgo inmediato, no esperes la respuesta de la plataforma.
          Contacta directamente a la Unidad de Bienestar o llama a Salud Responde al 600 360 7777.
        </p>
      </aside>
    </div>
  );
}
