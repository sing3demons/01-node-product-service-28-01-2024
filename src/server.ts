import express, { Application, Request, Response } from 'express'
import os from 'os'
import KafkaNode from './lib/kafka/kafka.js'
import Logger from './lib/logger/logger.js'

class Server {
  static async start() {
    const app: Application = express()
    const port = process.env.PORT ?? 3000
    const host = os.hostname(),
      platform = os.platform(),
      arch = os.arch(),
      uptime = os.uptime(),
      totalmem = os.totalmem(),
      freemem = os.freemem()
      // cpus = os.cpus(),
      // networkInterfaces = os.networkInterfaces()

    app.use(express.json())

    app.get('/topics', async (req: Request, res: Response) => {
      try {
        const topics = await KafkaNode.listTopics()
        res.json(topics)
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ message: error.message })
        }
      }
    })

    app.post('/topics', async function (req: Request, res: Response) {
      try {
        const createTopic = await KafkaNode.createTopics(req.body.topics)
        res.json({ createTopic })
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ message: error.message })
        }
      }
    })

    app.delete('/topics/:topic', async (req: Request, res: Response) => {
      try {
        const deleteTopic = await KafkaNode.deleteTopics(req.params.topic)
        res.json({ message: `Topic ${req.params.topic} deleted with result ${deleteTopic}` })
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ message: error.message })
        }
      }
    })

    app.get('/healthz', (req: Request, res: Response) => res.sendStatus(200))

    const server = app.listen(port, () => {
      Logger.standard(`Server is running on port ${port}`, {
        host,
        port,
        platform,
        arch,
        uptime,
        totalmem,
        freemem,
        // networkInterfaces: Object.keys(networkInterfaces).map((key) => ({ name: key}))
      })
    })
    process.on('SIGTERM', () => {
      Logger.info('SIGTERM signal received: closing HTTP server')
      server.close(() => process.exit(0))
    })
    process.on('SIGINT', () => {
      Logger.info('SIGINT signal received: closing HTTP server')
      server.close(() => process.exit(0))
    })
  }
}

export default Server
