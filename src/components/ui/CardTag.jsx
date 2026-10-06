export default function CardTag({ children }) {
  return (
    <span className="rounded-full border-[1.5px] border-border px-3.5 py-1 text-[0.8125rem] font-semibold text-muted">
      {children}
    </span>
  )
}
