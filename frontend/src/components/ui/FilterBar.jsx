import Button from './Button'

// Barra de filtros. Los filtros se aplican al cambiar cada campo; el botón vuelve a cargar los datos
export default function FilterBar({ label, onSubmit, buttonLabel = 'Actualizar', children }) {
  function handleSubmit(event) {
    event.preventDefault()
    onSubmit?.()
  }

  return (
    <form
      aria-label={label}
      onSubmit={handleSubmit}
      className="mb-6 flex flex-wrap items-end gap-4 rounded-md border border-border bg-card p-5 shadow-subtle sm:rounded-lg sm:px-6"
    >
      {children}
      {onSubmit && (
        <Button type="submit" variant="secondary" className="w-full sm:w-auto">
          {buttonLabel}
        </Button>
      )}
    </form>
  )
}
