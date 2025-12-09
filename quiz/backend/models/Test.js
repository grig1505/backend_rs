const { Schema, model } = require('mongoose')

const optionSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    default: false
  }
})

const questionSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  options: [optionSchema]
})

const testSchema = new Schema({
  questions: [questionSchema]
}, {
  timestamps: true
})

const Test = model('Test', testSchema, 'tests')

module.exports = Test

