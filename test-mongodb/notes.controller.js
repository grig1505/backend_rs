const chalk = require('chalk')
const Note = require('./models/Note')

async function addNote(title) {
  const note = new Note({title})
  await note.save()
  console.log(chalk.bgGreen('Note was added!'))
}

async function getNotes() {
  const notes = await Note.find()
  //console.log(notes[0].id)
  return notes
}

async function removeNote(id) {
  const result = await Note.deleteOne({_id: id})
  if (result.deletedCount === 0) {
    throw new Error('Note not found')
  }
  console.log(chalk.red(`Note with id="${id}" has been removed.`))
}

async function updateNote(id, title) {
 const result = await Note.updateOne({_id: id}, {title})
 if (result.matchedCount === 0) {
   throw new Error('Note not found')
 }
 console.log(chalk.bgYellow(`Note with id="${id}" has been updated.`))
}

module.exports = {
  addNote, getNotes, removeNote, updateNote
}