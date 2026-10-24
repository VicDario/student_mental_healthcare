const VARIANTS = {
  primary:
    'border-transparent bg-forest-800 text-white shadow-[0_4px_14px_rgba(27,67,50,0.2)] hover:-translate-y-px hover:bg-forest-900',
  secondary: 'border-forest-500 bg-transparent text-forest-700 hover:border-forest-700 hover:bg-forest-50',
  danger:
    'border-transparent bg-crisis-text text-white shadow-[0_4px_14px_rgba(159,18,57,0.18)] hover:-translate-y-px hover:bg-rose-900',
}

export default function Button({ variant = 'primary', type = 'button', className = '', ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex cursor-pointer items-center justify-center rounded-full border-[1.5px] px-5.5 py-2.5 text-[0.9375rem] font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-500 active:translate-y-px ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  )
}
