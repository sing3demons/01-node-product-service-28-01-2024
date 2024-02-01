import express, { Application, Request, Response } from 'express'
import logger from './logger/logger.js'
import os from 'os'
import KafkaNode from './kafka/kafka.js'

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

    app.get('/topics', async (req: Request, res: Response) => {
      const topics = await KafkaNode.listTopics()
      res.json(topics)
    })

    app.post('/topics', async (req: Request, res: Response) => {
      const createTopic = await KafkaNode.createTopics(req.body.topics)
      res.json({ createTopic })
    })

    app.delete('/topics/:topic', async (req: Request, res: Response) => {
      const deleteTopic = await KafkaNode.deleteTopics(req.params.topic)
      res.json({ message: `Topic ${req.params.topic} deleted with result ${deleteTopic}` })
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
