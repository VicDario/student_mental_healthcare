export default function Section({ id, alt = false, className = '', children }) {
  return (
    <section id={id} className={`scroll-mt-28 py-20 ${alt ? 'bg-card' : ''} ${className}`}>
      <div className="mx-auto max-w-[1200px] px-5">{children}</div>
    </section>
  )
}
