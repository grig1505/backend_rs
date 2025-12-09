const express = require('express')
const chalk = require('chalk')
const path = require('path')
const mongoose = require('mongoose')
//const Note = require('./models/Note')
const {addNote, getNotes, removeNote, updateNote} = require('./notes.controller')

const port = 3000
const app = express()

app.set('view engine', 'ejs')
app.set('views', 'pages')

app.use(express.static(path.resolve(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.get('/', async (req, res) => {
  res.render('index', {
    title: 'Express App',
    notes: await getNotes(),
    created: false,
    error: false
  })
})

app.post('/', async (req, res) => {
 try {
  await addNote(req.body.title)
  res.render('index', {
    title: 'Express App',
    notes: await getNotes(),
    created: true,
    error: null
  })
 } catch (error) {
  res.render('index', {
    title: 'Express App',
    notes: await getNotes(),
    created: false,
    error: error.message
  })
 }
})

app.delete('/:id', async (req, res) => {
  try {
    await removeNote(req.params.id)
    res.render('index', {
      title: 'Express App',
      notes: await getNotes(),
      created: false,
      error: false
    })
  } catch (error) {
    res.status(404).json({success: false, error: error.message})
  }
})

app.put('/:id', async (req, res) => {
  try {
    await updateNote(req.params.id, req.body.title)
    res.json({success: true})
  } catch (error) {
    res.status(404).json({success: false, error: error.message})
  }
})

mongoose.connect('mongodb://localhost:27017/dbshop', {
//  useNewUrlParser: true,
//  useUnifiedTopology: true
}).then(() => {
  console.log(chalk.green('Connected to MongoDB'))
 // Note.create({title: 'First note'})
  app.listen(port, () => {
    console.log(chalk.green(`Server has been started on port ${port}...`))
  })  
}).catch((error) => {
  console.log(chalk.red('Error connecting to MongoDB', error))
})

