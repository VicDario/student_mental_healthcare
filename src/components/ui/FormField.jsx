// Piezas reutilizables para formularios. Así todos los campos se ven iguales
// y no repetimos las mismas clases de Tailwind en cada página.

export const inputClass =
  'w-full rounded-sm border-[1.5px] border-border bg-white px-3.5 py-2.5 text-[0.95rem] text-body transition placeholder:text-muted/70 focus:border-forest-600 focus:outline-none focus:ring-4 focus:ring-forest-100'

// Etiqueta + campo. El `id` conecta el <label> con su input (accesibilidad).
export function Field({ id, label, required = false, hint, className = '', children }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-[0.88rem] font-bold text-forest-900">
        {label}
        {required && <span className="text-crisis-text"> *</span>}
      </label>
      {children}
      {hint && <p className="text-[0.8rem] text-muted">{hint}</p>}
    </div>
  )
}

// Opción de un grupo de radio buttons.
export function RadioOption({ id, name, value, label, required = false }) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-3 rounded-sm border-[1.5px] border-border bg-white px-3.5 py-2.5 text-[0.92rem] transition hover:border-forest-400 has-checked:border-forest-600 has-checked:bg-forest-50"
    >
      <input type="radio" id={id} name={name} value={value} required={required} className="size-4 accent-forest-700" />
      {label}
    </label>
  )
}

// Botones de enviar y limpiar que usan todos los formularios.
export function FormActions({ submitLabel }) {
  return (
    <div className="flex flex-wrap gap-3 pt-2">
      <button
        type="submit"
        className="inline-flex cursor-pointer items-center justify-center rounded-full bg-forest-800 px-7 py-3 font-bold text-white shadow-[0_4px_14px_rgba(27,67,50,0.2)] transition hover:-translate-y-0.5 hover:bg-forest-900"
      >
        {submitLabel}
      </button>
      <button
        type="reset"
        className="inline-flex cursor-pointer items-center justify-center rounded-full border-[1.5px] border-border bg-white px-6 py-3 font-bold text-forest-800 transition hover:border-forest-500 hover:bg-forest-50"
      >
        Limpiar formulario
      </button>
    </div>
  )
}
