// Error con código HTTP que los servicios lanzan y el errorHandler responde.
// errors es opcional: lista de { field, message } para indicar qué campo falló.
export class HttpError extends Error {
  constructor(status, message, errors = []) {
    super(message)
    this.status = status
    this.errors = errors
  }
}
