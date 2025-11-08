const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S[\s\S]{4,12}\S$/usg, 
      'Username must be between 4 and 12 characters long and can`t contain a space at the end/beginning'
    ]
    
  },
  name: {
    type: String,
    required: true,
    match: [/^[a-zA-Z ]{2,30}$/us, 
      'Name must be between 2 and 30 characters long, can contain only letters'
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
  ],
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

module.exports = mongoose.model('User', userSchema)