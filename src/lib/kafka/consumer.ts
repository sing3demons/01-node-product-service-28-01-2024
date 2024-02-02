import { EachMessagePayload } from 'kafkajs'
import Logger from '../logger/logger.js'

export async function consumeEventMessage({ topic, message, partition }: EachMessagePayload) {
  Logger.debug('kafka consumer', {
    topic,
    partition,
    message: message?.value?.toString()
  })

  switch (topic) {
    case 'test':
      // do something
      break
    default:
      break
  }
}
