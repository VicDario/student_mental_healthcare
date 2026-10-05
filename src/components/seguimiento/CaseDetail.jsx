import { CAMPUSES, findOption, labelOf, UNITS } from '../../data/catalogs'
import { CASE_STATUSES } from '../../data/cases'
import Badge from '../ui/Badge'
import DetailHeader from '../ui/DetailHeader'
import Divider from '../ui/Divider'
import Notice from '../ui/Notice'
import SummaryBox from '../ui/SummaryBox'
import CaseTimeline from './CaseTimeline'
import CloseCaseForm from './CloseCaseForm'

function CloseSection({ caseItem }) {
  if (caseItem.status === 'pending') {
    return (
      <Notice tone="warning" title="Cierre no disponible">
        Este caso está pendiente de revisión. Asigna un profesional responsable antes de registrar su cierre.
      </Notice>
    )
  }

  return (
    <>
      <p className="mb-4 text-[0.8125rem] text-muted">
        Solo disponible cuando el proceso de acompañamiento ha concluido y el profesional responsable autoriza el
        cierre.
      </p>
      <CloseCaseForm />
    </>
  )
}

export default function CaseDetail({ caseItem }) {
  const status = findOption(CASE_STATUSES, caseItem.status)

  return (
    <>
      <DetailHeader
        code={caseItem.id}
        badge={<Badge tone={status.tone}>{status.label}</Badge>}
        sensitive={caseItem.sensitive}
      />

      <SummaryBox eyebrow={caseItem.title}>
        {caseItem.professional} — {labelOf(UNITS, caseItem.unit)} · {labelOf(CAMPUSES, caseItem.campus)}
      </SummaryBox>

      <Divider />
      <CaseTimeline items={caseItem.timeline} />
      <Divider />

      <h3 className="mb-1 text-[0.9375rem] font-bold text-title">Cierre del caso</h3>
      <CloseSection caseItem={caseItem} />
    </>
  )
}
