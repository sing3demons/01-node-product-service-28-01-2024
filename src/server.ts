import express, { Application, Request, Response } from 'express'

class Server {
  static async start() {
    const app: Application = express()
    const port = process.env.PORT || 3000
    app.use(express.json())

    app.get('/', (req: Request, res: Response) => {
      res.json('Hello, This is Price Service!')
    })

    app.get('/healthz', (req: Request, res: Response) => res.sendStatus(200))

    const server = app.listen(port, () => console.log(`Server is running on port ${port}`))
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server')
      server.close(() => process.exit(0))
    })
    process.on('SIGINT', () => {
      console.log('SIGINT signal received: closing HTTP server')
      server.close(() => process.exit(0))
    })
  }
}

export default Server
