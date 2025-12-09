const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const testRoutes = require('./routes/testRoutes')

const app = express()
const port = 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// API routes
app.use('/api/test', testRoutes)

// Статическая раздача frontend (после сборки)
app.use(express.static(path.join(__dirname, '../frontend/dist')))

// Fallback для SPA роутинга (должен быть последним, после API и статики)
app.get('*', (req, res) => {
  // Пропускаем API запросы
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Not found' })
  }
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
})

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/quiz', {
  // useNewUrlParser: true,
  // useUnifiedTopology: true
}).then(() => {
  console.log('✓ Connected to MongoDB')
  app.listen(port, () => {
    console.log(`✓ Server has been started on port ${port}...`)
  })
}).catch((error) => {
  console.error('✗ Error connecting to MongoDB:', error.message)
  process.exit(1)
})

