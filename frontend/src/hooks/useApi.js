import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client'

// Carga datos de la API: { data, error, loading, reload }.
// Si path es null no carga nada (útil mientras no hay nada seleccionado).
export function useApi(path) {
  const [version, setVersion] = useState(0)
  const [result, setResult] = useState({ key: null, data: null, error: null })
  const key = path ? `${path}#${version}` : null

  useEffect(() => {
    if (!path) return
    let active = true
    api(path).then(
      (data) => active && setResult({ key, data, error: null }),
      (error) => active && setResult({ key, data: null, error }),
    )
    return () => {
      active = false
    }
  }, [path, key])

  const reload = useCallback(() => setVersion((current) => current + 1), [])

  return {
    data: path ? result.data : null,
    error: result.key === key ? result.error : null,
    loading: Boolean(key) && result.key !== key,
    reload,
  }
}
