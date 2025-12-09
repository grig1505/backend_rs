import axios from 'axios'

const API_URL = '/api/test'

// Получить тест
export async function getTest() {
  const response = await axios.get(API_URL)
  return response.data
}

// Обновить тест
export async function updateTest(testData) {
  const response = await axios.put(API_URL, testData)
  return response.data
}

// Работа с localStorage для истории прохождений
const HISTORY_KEY = 'quiz_history'

export function getHistory() {
  const history = localStorage.getItem(HISTORY_KEY)
  return history ? JSON.parse(history) : []
}

export function saveHistoryEntry(entry) {
  const history = getHistory()
  history.unshift({
    date: new Date().toISOString(),
    totalQuestions: entry.totalQuestions,
    correctAnswers: entry.correctAnswers
  })
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
}

