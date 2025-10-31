import "@testing-library/jest-dom"
import { TextEncoder, TextDecoder } from "util"

// Polyfill globals that JSDOM does not provide by default
globalThis.TextEncoder = TextEncoder as typeof globalThis.TextEncoder
globalThis.TextDecoder = TextDecoder as typeof globalThis.TextDecoder

class ResponseStub {
  private readonly body: unknown
  readonly status: number
  readonly ok: boolean

  constructor(body: unknown, init: ResponseInit = {}) {
    this.body = body
    this.status = init.status ?? 200
    this.ok = this.status >= 200 && this.status < 300
  }

  async json() {
    return this.body
  }

  static json(body: unknown, init?: ResponseInit) {
    return new ResponseStub(body, init)
  }
}

if (typeof globalThis.Response === "undefined") {
  globalThis.Response = ResponseStub as unknown as typeof Response
} else if (typeof globalThis.Response.json !== "function") {
  ;(globalThis.Response as unknown as { json: typeof ResponseStub.json }).json = ResponseStub.json.bind(ResponseStub)
}
