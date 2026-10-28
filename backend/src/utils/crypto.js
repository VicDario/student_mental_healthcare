import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'

// GCM cifra y detecta si el dato fue alterado o si la ENCRYPTION KEY no es la correcta
const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12

//la llave se lee solo cuando realmente se va a cifrar o descifrar.
function getKey() {
  //buffer para pasar de texto a bytes.
  const key = Buffer.from(process.env.ENCRYPTION_KEY ?? '', 'hex')

  if (key.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be 64 hex characters (32 bytes)')
  }

  return key
}

// Se guarda como "iv:authTag:cifrado", cada parte en base64
export function encrypt(text) {
  //vector inicializacion
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv(ALGORITHM, getKey(), iv)
  const encrypted = Buffer.concat([
    cipher.update(String(text), 'utf8'), //por si llega algo que no es texto, como un numero. Lo pasa a string
    cipher.final(), //se calcula el auth tag
  ])

  return [iv, cipher.getAuthTag(), encrypted]
    .map((part) => part.toString('base64')) //para almacenarse en mongo (se pasan bytes a texto)
    .join(':')
}

// Lanza error si la clave no es la correcta o si el dato fue modificado
export function decrypt(payload) {
  const [iv, authTag, encrypted] = payload.split(':').map((part) => Buffer.from(part, 'base64'))
  const decipher = createDecipheriv(ALGORITHM, getKey(), iv)
  decipher.setAuthTag(authTag)

  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8')
}

// Opciones para un campo de Mongoose: cifra al asignar y descifra al leer.
// Vacíos se dejan tal cual para que la validación "required" siga funcionando.
// Con .lean() no se aplican getters y se recibe el texto cifrado.
export const encryptedField = {
  set: (value) => (value == null || value === '' ? value : encrypt(value)),
  get: (value) => (value == null || value === '' ? value : decrypt(value)),
}
