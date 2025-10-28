const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method: ', request.method)
  logger.info('Url: ', request.url)
  //logger.info('Body: ', request.body)
  logger.info('Status: ', response.statusCode)
  logger.info('---')
  next() // testar se eu posso tirar o morgan do package json no final da parte 4
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)
  if (error.name === 'ValidationError') {
    let err = { name: '', number: '' }
    Object.values(error.errors).forEach(({ properties }) => {
      err[properties.path] = properties.message
      //console.log('err is', err)
    })
    const errorMessage = Object.values(error.errors)
      .map(({ properties }) => properties.message)
      .filter(msg => msg !== '').join(' | ')

    return response.status(400).json(errorMessage)
  } else if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}