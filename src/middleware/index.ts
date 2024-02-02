import { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'

function setRequestID() {
  return (req: Request, res: Response, next: NextFunction) => {
    req.headers['x-request-id'] ? req.headers['x-request-id'] : (req.headers['x-request-id'] = uuidv4())
    next()
  }
}

export { setRequestID }
