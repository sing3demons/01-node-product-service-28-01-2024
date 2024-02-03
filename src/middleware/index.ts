import { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'

function setRequestID() {
  return (req: Request, res: Response, next: NextFunction) => {
    req.headers['x-request-id'] ? req.headers['x-request-id'] : (req.headers['x-request-id'] = uuidv4())
    next()
  }
}

function getRequestId(req: Request) {
  const requestId = (req.headers['x-request-id'] as string) || uuidv4()
  return requestId
}

export { setRequestID, getRequestId }
