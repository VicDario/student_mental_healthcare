export default function SummaryBox({ eyebrow, children }) {
  return (
    <article className="mb-6 rounded-sm border border-border bg-subtle px-4 py-3.5">
      <p className="text-[0.8125rem] font-bold tracking-[0.06em] text-muted uppercase">{eyebrow}</p>
      <div className="mt-1 font-medium text-body">{children}</div>
    </article>
  )
}
