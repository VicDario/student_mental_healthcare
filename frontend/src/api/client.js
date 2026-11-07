// Cliente único para hablar con la API del backend.
// Guarda el token de sesión y avisa cuando la sesión expiró.

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'
const TOKEN_KEY = 'smh-token'

export const SESSION_EXPIRED_EVENT = 'smh:session-expired'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

// Error con el formato de la API: { message, errors: [{ field, message }] }
export class ApiError extends Error {
  constructor(status, message, errors = []) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

export async function api(path, { method = 'GET', body } = {}) {
  const token = getToken()
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(0, 'No pudimos conectar con el servidor. Revisa tu conexión e intenta de nuevo.')
  }

  const text = await response.text()
  // Si el servidor responde algo que no es JSON (ej. una página de error HTML), se avisa con un mensaje claro
  let data
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    throw new ApiError(response.status, 'Respuesta inesperada del servidor')
  }

  if (!response.ok) {
    // Con sesión iniciada, un 401 significa que expiró por inactividad o se cerró
    if (response.status === 401 && token) {
      setToken(null)
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))
    }
    throw new ApiError(response.status, data?.message ?? 'Ocurrió un error inesperado', data?.errors ?? [])
  }

  return data
}

// Arma "?a=1&b=2" omitiendo los filtros vacíos
export function toQuery(params) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  ).toString()
  return query ? `?${query}` : ''
}
