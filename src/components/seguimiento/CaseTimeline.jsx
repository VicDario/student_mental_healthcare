export default function CaseTimeline({ items }) {
  return (
    <>
      <h3 className="mb-4 text-[0.9375rem] font-bold text-title">Intervenciones registradas</h3>
      <ol
        aria-label="Historial de intervenciones"
        className="relative flex flex-col gap-4.5 pl-6 before:absolute before:top-1.5 before:bottom-1.5 before:left-1.25 before:w-0.5 before:bg-border"
      >
        {items.map((item) => (
          <li key={item.title} className="relative">
            <span
              aria-hidden="true"
              className={`absolute top-1.25 -left-6 size-3 rounded-full border-2 border-card ring-2 ${item.pending ? 'bg-card ring-border' : 'bg-forest-500 ring-forest-500'}`}
            />
            <p className="text-[0.8125rem] font-bold text-muted">{item.date}</p>
            <p className={`text-[0.9375rem] ${item.pending ? 'font-medium text-muted' : 'font-semibold text-title'}`}>
              {item.title}
            </p>
            {item.description && (
              <p className="mt-0.5 text-[0.8125rem] leading-normal text-muted">{item.description}</p>
            )}
          </li>
        ))}
      </ol>
    </>
  )
}
