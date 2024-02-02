import express, { Application, Request, Response } from 'express'
import { arch, freemem, hostname, networkInterfaces, platform, totalmem, uptime } from 'os'
import Logger from './lib/logger/logger.js'
import TopicController from './topic/topic.js'
import KafkaNode from './lib/kafka/kafka.js'

class Server {
  static async start() {
    const app: Application = express()
    const port = process.env.PORT ?? 3000
    const kafka = new KafkaNode()

    app.use(express.json())


    const topicController = new TopicController(kafka)
    app.get('/topics', topicController.getTopics)
    app.post('/topics', topicController.createTopics)
    app.delete('/topics/:topic', topicController.deleteTopics)

    app.get('/healthz', (req: Request, res: Response) => res.sendStatus(200))

    const server = app.listen(port, () => {
      Logger.standard(`Server is running on port ${port}`, {
        appName: 'product-service',
        host: hostname(),
        port,
        platform: platform(),
        arch: arch(),
        uptime: uptime(),
        totalmem: totalmem(),
        freemem: freemem(),
        network: Object.keys(networkInterfaces()).map((key) => ({ name: key }))
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
