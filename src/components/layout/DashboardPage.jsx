export default function DashboardPage({ title, subtitle, children }) {
  return (
    <div className="mx-auto w-full max-w-280 px-4 pb-10 sm:px-5">
      <header className="pb-6">
        <h1 className="text-[1.75rem] leading-tight font-extrabold tracking-tight text-title">{title}</h1>
        {subtitle && <p className="mt-2 max-w-[62ch] text-[0.92rem] text-muted">{subtitle}</p>}
      </header>
      {children}
    </div>
  )
}
