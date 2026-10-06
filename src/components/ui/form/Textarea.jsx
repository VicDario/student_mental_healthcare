import { CONTROL_CLASS } from './controlClass'

export default function Textarea(props) {
  return <textarea className={`${CONTROL_CLASS} min-h-27.5 resize-y`} {...props} />
}
