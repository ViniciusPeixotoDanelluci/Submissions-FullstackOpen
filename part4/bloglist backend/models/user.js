const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S[\s\S]{3,12}\S$/us,
      'Username must be between 3 and 12 characters long and can`t contain a space at the end/beginning'
    ]
  },
  name: {
    type: String,
    match: [/^[\p{L} ]{3,30}$/us, 
      'Name must be between 3 and 30 characters long, can contain only letters'
    ]
  },
  passwordHash: {
    type: String, 
    required: true
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v

    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User