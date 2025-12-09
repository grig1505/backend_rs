const Test = require('../models/Test')

// Получить тест (или создать по умолчанию)
async function getTest() {
  let test = await Test.findOne()
  
  if (!test) {
    // Создаем тест по умолчанию
    test = await Test.create({
      questions: [
        {
          text: 'Какой язык программирования используется для создания веб-приложений?',
          options: [
            { text: 'JavaScript', isCorrect: true },
            { text: 'HTML', isCorrect: false },
            { text: 'CSS', isCorrect: false },
            { text: 'Python', isCorrect: false }
          ]
        }
      ]
    })
  }
  
  return test
}

// Обновить тест
async function updateTest(testData) {
  const test = await Test.findOne()
  
  if (!test) {
    throw new Error('Тест не найден')
  }
  
  test.questions = testData.questions
  await test.save()
  
  return test
}

module.exports = {
  getTest,
  updateTest
}

