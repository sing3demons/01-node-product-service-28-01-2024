import express, { Application, Request, Response } from 'express'
import logger from './logger/logger.js'
import os from 'os'

class Server {
  static async start() {
    const app: Application = express()
    const port = process.env.PORT || 3000
    const host = os.hostname()

    app.use(express.json())

    app.get('/', (req: Request, res: Response) => {
      res.json('Hello, This is Price Service!')
    })

    app.get('/healthz', (req: Request, res: Response) => res.sendStatus(200))

    const server = app.listen(port, () => logger.standard(`Server is running on port ${port}`, { host, port }))
    process.on('SIGTERM', () => {
      logger.info('SIGTERM signal received: closing HTTP server')
      server.close(() => process.exit(0))
    })
    process.on('SIGINT', () => {
      logger.info('SIGINT signal received: closing HTTP server')
      server.close(() => process.exit(0))
    })
  }
}

export default Server
