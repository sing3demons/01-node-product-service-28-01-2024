import express, { Application, Request, Response } from 'express'
import logger from './logger/logger.js'
import os from 'os'

class Server {
  static async start() {
    const app: Application = express()
    const port = process.env.PORT || 3000
    const host = os.hostname(),
      platform = os.platform(),
      arch = os.arch(),
      uptime = os.uptime(),
      totalmem = os.totalmem(),
      freemem = os.freemem(),
      cpus = os.cpus(),
      networkInterfaces = os.networkInterfaces()

    app.use(express.json())

    app.get('/', (req: Request, res: Response) => {
      res.json('Hello, This is Price Service!')
    })

    app.get('/healthz', (req: Request, res: Response) => res.sendStatus(200))

    const server = app.listen(port, () => {
      logger.standard(`Server is running on port ${port}`, {
        host,
        port,
        platform,
        arch,
        uptime,
        totalmem,
        freemem,
        cpus: cpus.map((cpu) => cpu.model),
        networkInterfaces: Object.keys(networkInterfaces).map((key) => ({
          name: key
        }))
      })
    })
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
