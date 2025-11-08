const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1, })

  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  
  // Outra opção de Rege: ^([a-zA-Z0-9@#$%^&+=*.\-_]){3,20}$
  const passwordRegex = /^((?=\S*?[\p{L}])(?=\S*?[0-9]).{3,20})\S$/usg
  if (!password || !passwordRegex.test(password)) {
    return response.status(400).json({
      error: 'Password must be between 3 and 20 characters long and contain at least one letter and number. Can`t contain spaces'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })
  
  try {
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    return response.status(400).json({ error: error.message })
  }
})

module.exports = usersRouter