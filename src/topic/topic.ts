import KafkaNode from '../lib/kafka/kafka.js'
import { Request, Response } from 'express'
import Logger from '../lib/logger/logger.js'
import { getRequestId } from '../middleware/index.js'

class TopicController {
  private topicService: KafkaNode

  constructor(topicService: KafkaNode) {
    this.topicService = topicService
  }

  async getTopics(req: Request, res: Response) {
    const sessionId = getRequestId(req)
    try {
      const kafka = new KafkaNode()
      const topics = await kafka.listTopics(sessionId)
      if (topics === undefined) {
        throw new Error('topics is undefined')
      }
      Logger.info('getTopics', { topics }, sessionId)
      res.json(topics)
    } catch (error) {
      Logger.error('error::getTopic', error, sessionId)
      if (error instanceof Error) {
        res.status(500).json({ message: error.message })
      }
    }
  }

  async createTopics(req: Request, res: Response) {
    try {
      const kafka = new KafkaNode()
      const createTopic = await kafka.createTopics(req.body.topic)
      res.json({ message: createTopic ? 'success' : 'failed', topic: req.body.topic })
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message })
      }
    }
  }

  async deleteTopics(req: Request, res: Response) {
    try {
      await this.topicService.deleteTopics(req.params.topic)
      res.json({ message: 'success', topic: req.params.topic })
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message })
      }
    }
  }

  async sendMessages(req: Request, res: Response) {
    const sessionId = getRequestId(req)
    try {
      const topic = req.params.topic
      const headers = req.headers
      const body = req.body
      const result = await KafkaNode.sendMsg(topic, headers, body)

      Logger.info('sendMessages', { result, topic, headers, body }, sessionId)

      res.json({ message: result ? 'success' : 'failed' })
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message })
      }
    }
  }
}

export default TopicController
