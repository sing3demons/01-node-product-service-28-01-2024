import express, { Application, Request, Response } from 'express'
import { arch, freemem, hostname, networkInterfaces, platform, totalmem, uptime } from 'os'
import helmet from 'helmet'

import Logger from './lib/logger/logger.js'
import TopicController from './topic/topic.js'
import KafkaNode from './lib/kafka/kafka.js'
import { setRequestID } from './middleware/index.js'

class Server {
  static async start() {
    const app: Application = express(),
      port = process.env.PORT ?? 3000,
      kafka = new KafkaNode()

    app.use(express.urlencoded({ extended: true }))
    app.use(express.json({ limit: '50mb' }))
    app.use(helmet())
    app.use(setRequestID())

    const topicController = new TopicController(kafka)
    app.get('/topics', topicController.getTopics)
    app.post('/topics', topicController.createTopics)
    app.delete('/topics/:topic', topicController.deleteTopics)

    app.get('/healthz', (req: Request, res: Response) => {
      const requestId = req.headers['x-request-id']
      Logger.info('healthz', { requestId })
      res.sendStatus(200)
    })

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
        network: Object.keys(networkInterfaces())
          .map(key => key)
          .toString()
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
