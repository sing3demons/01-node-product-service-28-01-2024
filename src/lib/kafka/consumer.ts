import { EachMessagePayload } from 'kafkajs'
import Logger from '../logger/logger.js'
import { IPayload } from './payload.js'

export async function consumeEventMessage({ topic, message, partition }: EachMessagePayload) {
  console.log('=================>', topic)
  const { value, timestamp } = message
  const data = parseJson<IPayload>(value?.toString())
  if (data.error !== null) {
    Logger.error('kafka consumer', {
      topic,
      partition,
      value,
      timestamp
    })
    return
  }

  const { header, body } = data.payload

  Logger.info('kafka consumer', {
    topic,
    partition,
    header,
    body,
    timestamp
  })

  switch (topic) {
    case 'test':
      // do something
      break
    default:
      break
  }
}

function parseJson<T extends Object>(data: string | undefined) {
  if (!data) {
    return {
      payload: {} as T,
      error: new Error('data is undefined')
    }
  }

  try {
    // return JSON.parse(data) as T
    return {
      payload: JSON.parse(data) as T,
      error: null
    }
  } catch (error) {
    return {
      payload: {} as T,
      error: new Error('data is undefined')
    }
  }
}
