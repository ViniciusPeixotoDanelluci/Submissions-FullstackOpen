const logger = require('./logger')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)

  // Added this one for flavor
  response.on('finish', () => {
    logger.info('Code:', response.statusCode)
    logger.info('---')
  })
  next() // testar se eu posso tirar o morgan do package json no final da parte 4
}

const tokenExtractor = (request, resonse, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
    console.log('chegou até aqui')
  } else {
    request.token = null
  }
  next()
}

const userExtractor = async (request, response, next) => {
  const token = request.token

  if (token) {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (decodedToken.id) {
      const User = require('../models/user')
      request.user = await User.findById(decodedToken.id)
    }
  }
  next()
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
    })
    const errorMessage = Object.values(error.errors)
      .map(({ properties }) => properties.message)
      .filter(msg => msg !== '').join(' | ')
    return response.status(400).json(errorMessage)
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }

  next(error)
}

module.exports = {
  requestLogger,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler
}