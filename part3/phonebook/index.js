const express = require('express')
const app = express()

app.use(express.json())

let persons = [
  {
    id: '1',
    name: "Arto Hellas", 
    number: "040-123456"
  },
  {
    id: '2',
    name: "Ada Lovelace", 
    number: "39-44-5323523"
  },
  {
    id: '3',
    name: "Dan Abramov", 
    number: "12-43-234345"
  },
  { 
    id: "4",
    name: "Mary Poppendieck", 
    number: "39-23-6423122"
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello!</h1>')
})

app.get('/api/persons', (request, response) => {
  
  response.json(persons)
  console.log(request.headers)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find((person) => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/infos', (request, response) => {
  const gmtTime = new Date()

  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${gmtTime}</p>
  `)
})

const generateId = () => {
  return Math.floor(Math.random() * 1000000).toString()
}

app.post('/api/persons', (request, response) => {
  const entry = request.body
  
  if (!entry.name || !entry.number) {
    return response.status(400).json({
      error: 'name or number missing',
    })
  }
  const newPerson = {
    id: generateId(),
    name: entry.name,
    number: entry.number
  }

  persons = persons.concat(newPerson)

  response.json(newPerson)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter((person) => person.id !== id)

  response.status(204).end()
})

/*app.put('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const entry = request.body

  if (!entry.name || !entry.number) {
    return response.status(400).json({
      error: 'name or number missing',
    })
  }

  const person = persons.find((person) => person.id === id)

  if (!person) {
    return response.status(404).json({
      error: 'person not found',
    })
  }

  const updatedPerson = { ...person, ...entry }
  persons = persons.map((p) => (p.id === id ? updatedPerson : p))

  response.json(updatedPerson)
})*/

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
