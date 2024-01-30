import KafkaNode from './kafka/kafka.js'
import Server from './server.js'

(function main() {
  Server.start()
  KafkaNode.startConsumer()
})()
