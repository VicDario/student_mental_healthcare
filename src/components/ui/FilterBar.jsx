import Button from './Button'

export default function FilterBar({ label, children }) {
  return (
    <form
      aria-label={label}
      className="mb-6 flex flex-wrap items-end gap-4 rounded-md border border-border bg-card p-5 shadow-subtle sm:rounded-lg sm:px-6"
    >
      {children}
      <Button variant="secondary" className="w-full sm:w-auto">
        Aplicar filtros
      </Button>
    </form>
  )
}
