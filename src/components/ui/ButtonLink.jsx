import { Link } from 'react-router'

const VARIANTS = {
  primary:
    'rounded-full bg-forest-800 px-7 py-3.5 text-white shadow-[0_4px_14px_rgba(27,67,50,0.2)] hover:-translate-y-0.5 hover:bg-forest-900',
  secondary:
    'rounded-full border-[1.5px] border-border bg-white px-6 py-3.5 text-forest-800 hover:border-forest-500 hover:bg-forest-50',
  white: 'rounded-full bg-white px-7 py-3.5 text-forest-900 hover:-translate-y-0.5 hover:bg-forest-50',
  soft: 'rounded-sm border border-forest-200 bg-forest-100 px-4 py-[11px] text-[0.88rem] text-forest-800 hover:bg-forest-800 hover:text-white',
}

// Usa `to` para rutas internas de React Router y `href` para anclas (#seccion) o enlaces externos.
export default function ButtonLink({ to, href, variant = 'primary', className = '', children }) {
  const classes = `inline-flex items-center justify-center gap-2 font-bold transition ${VARIANTS[variant]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <a href={href} className={classes}>
      {children}
    </a>
  )
}
