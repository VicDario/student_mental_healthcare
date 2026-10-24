import Badge from '../ui/Badge'
import DetailHeader from '../ui/DetailHeader'
import Divider from '../ui/Divider'
import SummaryBox from '../ui/SummaryBox'
import CaseTimeline from './CaseTimeline'
import CloseCaseForm from './CloseCaseForm'

export default function CaseDetail({ caseItem }) {
  return (
    <>
      <DetailHeader
        code={caseItem.id}
        badge={<Badge tone={caseItem.status.tone}>{caseItem.status.label}</Badge>}
        sensitive={caseItem.sensitive}
      />

      <SummaryBox eyebrow={caseItem.title}>
        {caseItem.professional} — {caseItem.unit} · {caseItem.campus}
      </SummaryBox>

      <Divider />
      <CaseTimeline items={caseItem.timeline} />
      <Divider />

      <h3 className="mb-1 text-[0.9375rem] font-bold text-title">Registrar cierre de caso</h3>
      <p className="mb-4 text-[0.8125rem] text-muted">
        Solo disponible cuando el proceso de acompañamiento ha concluido y el profesional responsable autoriza el
        cierre.
      </p>
      <CloseCaseForm />
    </>
  )
}
