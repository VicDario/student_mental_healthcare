// Error con código HTTP que los servicios lanzan y el errorHandler responde
export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}
