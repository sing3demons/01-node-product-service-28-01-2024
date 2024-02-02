import { Kafka, logLevel } from 'kafkajs'
import Payload from './payload.js'
import { consumeEventMessage } from './consumer.js'
import Logger from '../logger/logger.js'

export default class KafkaNode {
  public kafka: Kafka
  constructor() {
    const brokers = process.env.KAFKA_BROKERS?.split(',')
    if (!brokers) {
      throw new Error('KAFKA_BROKERS is required')
    }

    const clientId = process.env.KAFKA_CLIENT_ID
    if (!clientId) {
      throw new Error('KAFKA_CLIENT_ID is required')
    }

    this.kafka = new Kafka({
      logLevel: logLevel.INFO,
      clientId,
      brokers,
      requestTimeout: 25000,
      retry: {
        factor: 0,
        multiplier: 4,
        maxRetryTime: 25000,
        retries: 10
      }
    })
  }

  static async startConsumer() {
    try {
      const topics = process.env.KAFKA_TOPICS?.split(',')
      if (!topics) {
        throw new Error('KAFKA_TOPICS is required')
      }
      const { kafka } = new KafkaNode()
      kafka.logger().info('Connecting... ')
      const admin = kafka.admin()
      await admin.connect()

      const listTopics = await admin.listTopics()

      if (listTopics.length) {
        const noExits = topics.filter(topic => !listTopics.includes(topic))
        if (noExits.length > 0) {
          for (const topic of noExits) {
            const createTopic = await admin.createTopics({
              topics: [
                {
                  topic,
                  numPartitions: 3, // Number of partitions
                  replicationFactor: 1 // Replication factor
                }
              ]
            })
            kafka.logger().info(`NEW : Topic ${topic} created with result ${createTopic}`)
          }
        }
      } else {
        for (const topic of topics) {
          const createTopic = await admin.createTopics({
            topics: [
              {
                topic,
                numPartitions: 3, // Number of partitions
                replicationFactor: 1 // Replication factor
              }
            ]
          })
          kafka.logger().info(`Topic ${topic} created with result ${createTopic}`)
        }
      }

      if (topics.length > 0) {
        const noExits = listTopics.filter(topic => !topics.includes(topic))
        if (noExits.length > 0) {
          for (const topic of noExits) {
            await admin.deleteTopics({
              topics: [topic]
            })
            kafka.logger().info(`DELETE : Topic ${topic} deleted with result ${topic}`)
          }
        }
      }

      await admin.disconnect()

      const groupId = process.env.KAFKA_GROUP_ID
      if (!groupId) {
        throw new Error('KAFKA_GROUP_ID is required')
      }
      const consumer = kafka.consumer({ groupId: groupId })
      await consumer.connect()
      await consumer.subscribe({ topics, fromBeginning: true })
      consumer.run({ eachMessage: consumeEventMessage })
    } catch (error) {
      throw error
    }
  }

  static async sendMsg(topic: string, headers: Record<string, unknown>, body: Record<string, unknown>) {
    try {
      const { kafka } = new KafkaNode()
      const producer = kafka.producer()
      await producer.connect()

      const value = Payload.set(headers, body)

      const result = await producer.send({
        topic,
        messages: [{ value: JSON.stringify(value) }]
      })
      kafka.logger().info(`Send Successfully ${JSON.stringify(result)}`)
      await producer.disconnect()
    } catch (error) {
      throw error
    }
  }

  async listTopics(session: string) {
    try {
      const admin = this.kafka.admin()
      await admin.connect()
      const topics = await admin.listTopics()
      const groups = await admin.listGroups()
      await admin.disconnect()
      Logger.info(
        'listTopics',
        {
          topics,
          groups: admin.listGroups()
        },
        session
      )
      return { topics, groups }
    } catch (error) {
      Logger.error('listTopics', { error: error }, session)
      throw error
    }
  }

  async createTopics(topics: string) {
    try {
      const admin = this.kafka.admin()
      await admin.connect()
      const createTopic = await admin.createTopics({
        topics: [{ topic: topics }]
      })
      await admin.disconnect()
      return createTopic
    } catch (error) {
      throw error
    }
  }

  async deleteTopics(topics: string) {
    try {
      const admin = this.kafka.admin()
      await admin.connect()
      await admin.deleteTopics({
        topics: topics.split(',')
      })
      await admin.disconnect()
    } catch (error) {
      throw error
    }
  }
}
