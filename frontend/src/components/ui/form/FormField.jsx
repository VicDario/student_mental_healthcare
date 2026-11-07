export default function FormField({ id, label, hint, error, className = 'mb-4', children }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="text-[0.8125rem] font-semibold text-forest-900">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-[0.8125rem] font-medium text-crisis-text">
          {error}
        </p>
      )}
      {hint && !error && <p className="text-[0.8125rem] text-muted">{hint}</p>}
    </div>
  )
}
