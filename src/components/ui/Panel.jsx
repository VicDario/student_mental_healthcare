export default function Panel({ id, title, count, children }) {
  return (
    <section aria-labelledby={id} className="rounded-lg border border-border bg-card p-5 shadow-subtle sm:p-6">
      <div className="mb-5 flex items-baseline justify-between gap-2 border-b border-border-subtle pb-4">
        <h2 id={id} className="text-[1.125rem] font-bold text-title">
          {title}
        </h2>
        {count && (
          <p className="shrink-0 rounded-full bg-subtle px-2.5 py-0.5 text-[0.8125rem] font-semibold text-muted">
            {count}
          </p>
        )}
      </div>
      {children}
    </section>
  )
}
