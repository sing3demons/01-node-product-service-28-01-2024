import KafkaNode from '../lib/kafka/kafka.js'
import { Request, Response } from 'express'

class TopicController {
  private topicService: KafkaNode

  constructor(topicService: KafkaNode) {
    this.topicService = topicService
  }

  async getTopics(req: Request, res: Response) {
    try {
      const topics = await this.topicService.listTopics()
      res.json(topics)
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message })
      }
    }
  }

  async createTopics(req: Request, res: Response) {
    try {
      const createTopic = await this.topicService.createTopics(req.body.topic)
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
}

export default TopicController
