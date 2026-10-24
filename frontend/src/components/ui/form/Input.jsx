import { CONTROL_CLASS } from './controlClass'

export default function Input({ type = 'text', ...props }) {
  return <input type={type} className={CONTROL_CLASS} {...props} />
}
