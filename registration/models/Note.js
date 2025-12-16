const { Schema, model } = require('mongoose')

const noteSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  }
})
const Note = model('Note', noteSchema, 'notes')
module.exports = Note;