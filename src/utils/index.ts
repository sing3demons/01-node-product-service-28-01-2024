import sensitive from './sensitive.js'

function makeStructuredClone<T>(obj: T): T {
  if (typeof obj === 'undefined') {
    return obj
  }
  const payload = JSON.parse(JSON.stringify(obj)) // structuredClone(obj)
  if (typeof payload === 'object') {
    if (Array.isArray(payload)) {
      for (const item of payload) {
        if (typeof item === 'object') {
          sensitive.masking(item)
        }
      }
    } else {
      sensitive.masking(payload)
    }
  }
  return payload
}

export { makeStructuredClone }
