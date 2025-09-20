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
  name: String,
  number: String,
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
