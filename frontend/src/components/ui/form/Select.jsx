import { CONTROL_CLASS } from './controlClass'

export default function Select({ options, placeholder, ...props }) {
  return (
    <select className={CONTROL_CLASS} {...props}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  )
}
