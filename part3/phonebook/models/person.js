require('dotenv').config()
const mongoose = require('mongoose')

const iName = process.argv[3]
const iNumber = process.argv[4]

const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Enter a name at least 3 characters long'],
    required: true
  },
  number: {
    type: String,
    minLength: [8, 'Please enter a number at least 8 characters long'],
    maxLength: [15, 'The phone number must not exceed the maximum of 15 characters'],
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d+$/.test(v)
      },
      message: 'Please insert a valid phone number e.g. 055-45678900'
    }
    //validate: { }
    //regex aqui
    // LEmbrar de checar se eu to mandando os status de bad request corretos 
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 5) {
  const person = new Person({
    name: iName,
    number: iNumber,
  })

  person
    .save()
    .then(result => {
      console.log(`${iName} added to the phonebook!`)
      mongoose.connection.close()
    }).catch((err) => {
      console.log(err) 
      mongoose.connection.close()
    })
} else if (process.argv.length == 3) {
  Person
    .find({})
    .then(result => {
      console.log('phonebook:') 
      result.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    })
}

module.exports = mongoose.model('Person', personSchema)
