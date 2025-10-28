//require('dotenv').config()
const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: [3, 'Enter a title at least 3 characters long']
  },
  author: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
  },
  /*name: {
    type: String,
    minLength: [3, 'Enter a name at least 3 characters long'],
    required: true,
    match: [/^\p{L}*(?:[ ]\p{L}+)*$/u, 'Please insert a valid name e.g. João da Silva with no special characters or spaces at the beginning or end']
  },
  email: {
    type: String,
    minLength: [8, 'Please enter a number at least 8 characters long'],
    maxLength: [15, 'The phone number must not exceed the maximum of 15 characters'],
    required: true,
    match: [/^\d{2,3}-\d+$/, 'Please insert a valid phone number e.g. 055-18997497974']
  },*/
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)
