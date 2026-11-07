import { formatDate, STATUS_TONES, statusLabel } from '../../utils/labels'
import Badge from '../ui/Badge'

const COLUMNS = ['Folio', 'Fecha', 'Motivo', 'Estado']

export default function SolicitudesHistorial({ requests }) {
  return (
    <>
      <p className="mb-4 text-[0.8125rem] text-muted">Solo tú y los profesionales autorizados pueden ver este historial.</p>

      <div className="overflow-x-auto rounded-sm border border-border">
        <table className="w-full min-w-140 border-collapse text-left text-[0.875rem]">
          <caption className="sr-only">Solicitudes que has ingresado previamente</caption>
          <thead className="bg-subtle text-[0.75rem] tracking-[0.06em] text-muted uppercase">
            <tr>
              {COLUMNS.map((column) => (
                <th key={column} scope="col" className="px-4 py-3 font-bold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className="border-t border-border-subtle">
                <th scope="row" className="px-4 py-3 font-semibold whitespace-nowrap text-title">
                  {request.code}
                </th>
                <td className="px-4 py-3 whitespace-nowrap text-muted">{formatDate(request.createdAt)}</td>
                <td className="px-4 py-3">
                  {request.reason}
                  {request.origin === 'referral' && (
                    <span className="block text-[0.8125rem] text-muted">Sugerida por un docente</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Badge tone={STATUS_TONES[request.status]}>{statusLabel(request.status)}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
