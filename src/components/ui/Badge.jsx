const TONES = {
  success: 'bg-forest-100 text-forest-800',
  warning: 'bg-warning-bg text-warning-text',
  danger: 'bg-crisis-bg text-crisis-text',
  info: 'bg-blue-50 text-blue-800',
  neutral: 'bg-slate-100 text-slate-500',
}

export default function Badge({ tone = 'neutral', children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-0.75 text-[0.8125rem] font-semibold whitespace-nowrap ${TONES[tone]}`}
    >
      {children}
    </span>
  )
}
