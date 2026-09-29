export default function SectionHeader({ title, children }) {
  return (
    <header className="mx-auto mb-12 max-w-[720px] text-center">
      <h2 className="mb-3 text-[2rem] font-extrabold tracking-tight text-forest-900">{title}</h2>
      {children && <p className="text-muted">{children}</p>}
    </header>
  )
}
