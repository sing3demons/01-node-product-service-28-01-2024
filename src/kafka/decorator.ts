function PayloadDecorator() {
  return function (target: any) {
    return class extends target {
      private header: Record<string, unknown>
      private body: Record<string, unknown>

      constructor(header: Record<string, unknown>, body: Record<string, unknown>) {
        super()
        this.header = header ?? {}
        this.body = body ?? {}
      }

      getHeader() {
        return this.header
      }

      getBody() {
        return this.body
      }

      static set(header: Record<string, unknown>, body: Record<string, unknown>) {
        return new this(header, body)
      }
    }
  }
}

export default PayloadDecorator
