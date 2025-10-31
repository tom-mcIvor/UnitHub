export function createJsonRequest(body: unknown): Request {
  const rawBody = body

  return {
    async json() {
      if (typeof rawBody === "string") {
        return JSON.parse(rawBody)
      }

      return rawBody
    },
    async text() {
      if (typeof rawBody === "string") {
        return rawBody
      }

      return JSON.stringify(rawBody)
    },
  } as unknown as Request
}
