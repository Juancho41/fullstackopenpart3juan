const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  number: {
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator: function (v) {
        if(/-/.test(v)) {
          return /\d{2,3}-\d{6,}/.test(v);
        }
        return /\d{8,}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.date
  }
})

module.exports = mongoose.model('Person', personSchema)