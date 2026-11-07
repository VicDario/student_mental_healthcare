import { useState } from 'react'

// Envía un formulario a la API y guarda el error con el formato { message, errors }.
// fieldError('email') devuelve el mensaje de ese campo para mostrarlo bajo el input.
export function useSubmit() {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  async function submit(action, successMessage) {
    setPending(true)
    setError(null)
    setSuccess(null)
    try {
      const result = await action()
      if (successMessage) setSuccess(successMessage)
      return result
    } catch (caught) {
      setError(caught)
      return null
    } finally {
      setPending(false)
    }
  }

  const fieldError = (field) => error?.errors?.find((item) => item.field === field)?.message

  return { submit, pending, error, success, fieldError, clear: () => setError(null) }
}
