export default function Choice({ type = 'checkbox', className = '', children, ...inputProps }) {
  return (
    <label className={`flex cursor-pointer items-start gap-2 text-[0.9375rem] ${className}`}>
      <input type={type} className="mt-1.25 size-4 shrink-0 accent-forest-700" {...inputProps} />
      <span>{children}</span>
    </label>
  )
}
