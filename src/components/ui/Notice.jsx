const TONES = {
  success: { box: 'border-forest-400 bg-forest-50', title: 'text-forest-700' },
  warning: { box: 'border-warning-border bg-warning-bg', title: 'text-warning-text' },
}

export default function Notice({ tone = 'success', title, className = '', children }) {
  const styles = TONES[tone]

  return (
    <div role="status" className={`rounded-sm border-[1.5px] px-4.5 py-4 ${styles.box} ${className}`}>
      {title && <p className={`mb-1 text-[0.9375rem] font-bold ${styles.title}`}>{title}</p>}
      <div className="text-[0.8125rem] text-body">{children}</div>
    </div>
  )
}
