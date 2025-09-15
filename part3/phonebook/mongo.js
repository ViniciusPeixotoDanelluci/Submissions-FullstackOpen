const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Give atleast a password as argument')
  process.exit(1)
}

const password = process.argv[2]
const iName = process.argv[3]
const iNumber = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@cluster0.glbeuwq.mongodb.net/personApp?retryWrites=true&w=majority`
mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
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
  Person.find({})
    .then(result => {
      console.log('phonebook:') 
      result.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    })
} else {
  console.log('Please provide a name and number as arguments')
  mongoose.connection.close()
  process.exit(1)
}

