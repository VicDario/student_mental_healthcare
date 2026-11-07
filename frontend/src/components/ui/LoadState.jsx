// Mensajes comunes mientras se cargan datos, si hay error o si la lista está vacía
export default function LoadState({ loading, error, empty, emptyText = 'No hay registros para mostrar.', children }) {
  if (error) {
    return (
      <p role="alert" className="rounded-sm border border-crisis-border bg-crisis-bg px-4 py-3 text-[0.875rem] text-crisis-text">
        {error.message}
      </p>
    )
  }
  if (loading && empty) return <p className="py-6 text-center text-[0.875rem] text-muted">Cargando…</p>
  if (empty) return <p className="py-6 text-center text-[0.875rem] text-muted">{emptyText}</p>
  return children
}
