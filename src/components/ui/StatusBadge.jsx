// Etiqueta de color para mostrar estados (Activo, Inactivo, Cerrada, etc.).
const TONES = {
  success: 'bg-forest-100 text-forest-800',
  neutral: 'bg-subtle text-muted',
  warning: 'bg-warning-bg text-warning-text',
}

export default function StatusBadge({ tone = 'success', children }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-[0.78rem] font-bold ${TONES[tone]}`}>
      {children}
    </span>
  )
}
