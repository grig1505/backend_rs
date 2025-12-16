const chalk = require('chalk')
const Note = require('./models/Note')

async function addNote(title , owner) {
  await Note.create({title, owner})
  
 // await note.save()
  console.log(chalk.bgGreen('Note was added!'))
}

async function getNotes() {
  const notes = await Note.find()
  //console.log(notes[0].id)
  return notes
}

async function removeNote(id, owner) {
  const result = await Note.deleteOne({_id: id, owner})
  if (result.deletedCount === 0) {
    throw new Error('No Note not found')
  }
  console.log(chalk.red(`Note with id="${id}" has been removed.`))
}

async function updateNote(noteData, owner) {
 const result = await Note.updateOne({_id: noteData._id, owner}, {title: noteData.title})
 console.log(result);
 if (result.matchedCount === 0) {
   throw new Error('Note not found')
 }
 console.log(chalk.bgYellow(`Note with id="${noteData._id}" has been updated.`))
}

module.exports = {
  addNote, getNotes, removeNote, updateNote
}