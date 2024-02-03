class Payload {
  private header: Record<string, unknown>
  private body: Record<string, unknown>

  constructor(header: Record<string, unknown>, body: Record<string, unknown>) {
    this.header = header
    this.body = body
  }

  getHeader() {
    return this.header
  }

  getBody() {
    return this.body
  }

  static set(header: Record<string, unknown>, body: Record<string, unknown>) {
    return new Payload(header, body)
  }
}

export interface IPayload {
  header: Record<string, unknown>
  body: Record<string, unknown>
}

export default Payload
