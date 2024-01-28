import { Logger, createLogger, format, transports } from 'winston'
import sensitive from '../utils/sensitive.js'
import ignoreCase from '../utils/ignore.js'

let level = process.env.LOG_LEVEL || 'debug'
if (process.env.NODE_ENV === 'production') {
  level = 'info'
}

const myFormat = format.printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}] : ${message} `
  if (metadata) {
    msg += JSON.stringify(metadata)
  }
  return msg
})

function NewLogger(serviceName: string): Logger {
  return createLogger({
    level: level,
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss', alias: '@timestamp' }),
      myFormat,
      format.json({
        replacer(key, value) {
          if (ignoreCase.equal(key, 'password')) {
            return sensitive.maskPassword(value)
          } else if (ignoreCase.equal(key, 'email')) {
            return sensitive.maskEmail(value)
          } else if (ignoreCase.equal(key, 'mobileNo')) {
            return sensitive.maskNumber(value)
          } else if (ignoreCase.equal(key, 'phone')) {
            return sensitive.maskPassword(value)
          }
          return value
        }
        // space: 2
      })
    ),
    exceptionHandlers: [],
    exitOnError: false,
    transports: [
      new transports.Console({
        level: level,
        handleExceptions: true
      })
    ],
    defaultMeta: { serviceName: serviceName }
  })
}

const log = NewLogger('product-service')

interface ILogger {
  info(message: string, data?: {} | [], session?: string): void
  error(message: string, data?: {} | [], session?: string): void
  debug(message: string, data?: {} | [], session?: string): void
}

const logger: ILogger = {
  info: (message: string, data?: {} | [], session?: string) => {
    const payload = structuredClone(data)
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
    log.info(message, { action: JSON.stringify(payload), session: session })
  },
  error: (message: string, data?: {} | [], session?: string) => {
    const payload = structuredClone(data)
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
    log.error(message, { action: JSON.stringify(payload), session: session })
  },
  debug: (message: string, data?: {} | [], session?: string) => {
    const payload = structuredClone(data)
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
    log.debug(message, { action: JSON.stringify(payload), session: session })
  }
}

export default logger
