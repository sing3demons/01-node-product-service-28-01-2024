import logger from './logger/logger.js'
import Server from './server.js'

// main function
;(async () => {
  Server.start()
  const user = [
    {
      password: 'product-service',
      email: 'test@test.com',
      mobileNo: '0812345678',
      data: {
        name: 'test',
        hash: [
          {
            password: '1234',
            email: 'admin@dev.com',
            profile: [
              {
                name: 'test',
                email: 'teff@test.com',
                mobileNo: '0812345678',
                password: '987456321',
                data: {
                  name: 'test',
                  hash: [
                    {
                      password: '1234',
                      email: 'ttttttt@twat.com'
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  ]

  // logger.info('Starting server...', user)
  logger.info('Starting server...', { user })
})()
