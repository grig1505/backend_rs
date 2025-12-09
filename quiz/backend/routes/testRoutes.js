const express = require('express')
const router = express.Router()
const { getTest, updateTest } = require('../controllers/testController')

// GET /api/test - получить тест
router.get('/', async (req, res) => {
  try {
    const test = await getTest()
    res.json(test)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// PUT /api/test - обновить тест
router.put('/', async (req, res) => {
  try {
    const { questions } = req.body
    
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'Тест должен содержать хотя бы один вопрос' })
    }
    
    // Валидация структуры
    for (const question of questions) {
      if (!question.text || !question.options || !Array.isArray(question.options) || question.options.length === 0) {
        return res.status(400).json({ error: 'Каждый вопрос должен содержать текст и хотя бы один вариант ответа' })
      }
      
      const hasCorrectAnswer = question.options.some(opt => opt.isCorrect === true)
      if (!hasCorrectAnswer) {
        return res.status(400).json({ error: 'Каждый вопрос должен иметь хотя бы один правильный ответ' })
      }
    }
    
    const test = await updateTest({ questions })
    res.json(test)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router

