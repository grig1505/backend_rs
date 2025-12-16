const { Schema, model} = require('mongoose')
const validator = require('validator')

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Invalid email address'
    }
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true })
const User = model('User', userSchema,'users')
module.exports = User;