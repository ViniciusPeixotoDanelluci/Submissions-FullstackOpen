require('dotenv').config()

const express = require('express')
const Person = require('./models/person')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body)
    ].join(' ')
  })
)

// Could just do that also :P
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
  .catch(error => next(error))
})

app.get('/info', (request, response) => {
  //Person.countDocuments({}).then(count => {})
  Person.estimatedDocumentCount({}).then(count => {
    const gmtTime = new Date()//.toUTCString()
    response.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${gmtTime}</p>
    `)
  })
})

app.post('/api/persons', (request, response, next) => {
  const entry = request.body
  
  const newPerson = new Person({
    name: entry.name,
    number: entry.number
  })

  newPerson
    .save()
    .then(savedEntry => {
      response.json(savedEntry)
    })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  const opts = { new: true, runValidators: true }

  Person.findByIdAndUpdate(request.params.id, { name, number }, opts)
    .then(entry => {
      if (!entry) {
        return response.status(404).end()
      }
      response.json(entry)
    })
  .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// Reminder: the "next" parameter is the "call function" to the ErrorHandler
const errorHandler = (error, request, response, next) => {

  if (error.name === 'ValidationError') {
    let err = { name: '', number: '' }
    Object.values(error.errors).forEach(({ properties }) => {
      err[properties.path] = properties.message
       console.log('err is', err)
      // console.log('properties is', properties)
    })

    const errorMessage = Object.values(error.errors)
                  .map(({ properties }) => properties.message)
                  .filter(msg => msg !== '').join(' | ')

    // console.log(error)
    // console.log(errorMessage)
    // It was a fun challenge to figure it out how to do make this message work
    return response.status(400).json(errorMessage)
    //return response.status(400).json(['ValidationError:', err.name, ' ', err.number])
  } else if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
