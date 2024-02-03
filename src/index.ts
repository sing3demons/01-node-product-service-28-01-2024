import KafkaNode from './lib/kafka/kafka.js'
import Server from './server.js'
import dotenv from 'dotenv'

dotenv.config({ encoding: 'utf-8' })
Server.start()
KafkaNode.startConsumer()
