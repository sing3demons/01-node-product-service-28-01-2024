import { Logger as WinstonLog, createLogger, format, transports } from 'winston'
import ignoreCase from '../utils/ignore.js'
import { makeStructuredClone } from '../utils/index.js'
import Sensitive from '../utils/sensitive.js'

let level = process.env.LOG_LEVEL ?? 'debug'
if (process.env.NODE_ENV === 'production') {
  level = 'info'
}

function NewLogger(serviceName: string): WinstonLog {
  const sensitive = new Sensitive()
  return createLogger({
    level: level,
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss', alias: '@timestamp' }),
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
  standard(message: string, ...meta: any[]): void
}

const logger: ILogger = {
  info: (message: string, data?: {} | [], session?: string) => {
    const action = makeStructuredClone(data)
    log.info(message, { action, session: session })
  },
  error: (message: string, data?: {} | [], session?: string) => {
    const action = makeStructuredClone(data)
    log.error(message, { action, session: session })
  },
  debug: (message: string, data?: {} | [], session?: string) => {
    const action = makeStructuredClone(data)
    log.debug(message, { action, session: session })
  },
  standard: (message: string, ...meta: any[]) => {
    log.info(message, ...meta)
  }
}

export { logger }
class Logger {
  static info(message: string, data?: {} | [], session?: string) {
    const action = makeStructuredClone(data)
    log.info(message, { action, session: session })
  }

  static error(message: string, data?: any, session?: string) {
    const action = makeStructuredClone(data)
    log.error(message, { action, session: session })
  }

  static debug(message: string, data?: {} | [], session?: string) {
    const action = makeStructuredClone(data)
    log.debug(message, { action, session: session })
  }

  static standard(message: string, ...meta: any[]) {
    log.info(message, ...meta)
  }
}

export default Logger
