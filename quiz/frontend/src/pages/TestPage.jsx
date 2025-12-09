import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTest } from '../services/api'
import { saveHistoryEntry } from '../services/api'
import './TestPage.css'

function TestPage() {
  const navigate = useNavigate()
  const [test, setTest] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [isFinished, setIsFinished] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTest()
  }, [])

  const loadTest = async () => {
    try {
      const testData = await getTest()
      setTest(testData)
      setLoading(false)
    } catch (error) {
      console.error('Ошибка загрузки теста:', error)
      setLoading(false)
    }
  }

  const handleAnswerSelect = (optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: optionIndex
    })
  }

  const handleNext = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleFinish = () => {
    let correctCount = 0
    
    test.questions.forEach((question, qIndex) => {
      const selectedIndex = selectedAnswers[qIndex]
      if (selectedIndex !== undefined) {
        const selectedOption = question.options[selectedIndex]
        if (selectedOption.isCorrect) {
          correctCount++
        }
      }
    })

    const resultData = {
      totalQuestions: test.questions.length,
      correctAnswers: correctCount
    }

    setResult(resultData)
    setIsFinished(true)
    saveHistoryEntry(resultData)
  }

  if (loading) {
    return <div className="test-page">Загрузка...</div>
  }

  if (!test || test.questions.length === 0) {
    return (
      <div className="test-page">
        <div className="test-container">
          <p>Тест пуст. Пожалуйста, добавьте вопросы в режиме редактирования.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            На главную
          </button>
        </div>
      </div>
    )
  }

  if (isFinished && result) {
    return (
      <div className="test-page">
        <div className="test-container">
          <div className="result-section">
            <h2 className="result-title">Результат прохождения теста</h2>
            <div className="result-stats">
              <div className="result-stat">
                <span className="stat-label">Верных ответов:</span>
                <span className="stat-value">{result.correctAnswers} из {result.totalQuestions}</span>
              </div>
              <div className="result-percentage">
                {Math.round((result.correctAnswers / result.totalQuestions) * 100)}%
              </div>
            </div>
            <div className="result-buttons">
              <button className="btn btn-primary" onClick={() => navigate('/')}>
                На главную
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setCurrentQuestionIndex(0)
                  setSelectedAnswers({})
                  setIsFinished(false)
                  setResult(null)
                }}
              >
                Пройти еще раз
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = test.questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === test.questions.length - 1
  const hasSelectedAnswer = selectedAnswers[currentQuestionIndex] !== undefined

  return (
    <div className="test-page">
      <div className="test-container">
        <div className="test-progress">
          Вопрос {currentQuestionIndex + 1} из {test.questions.length}
        </div>

        <div className="question-section">
          <h2 className="question-text">{currentQuestion.text}</h2>
          
          <div className="options-list">
            {currentQuestion.options.map((option, index) => (
              <label 
                key={index} 
                className={`option-item ${selectedAnswers[currentQuestionIndex] === index ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestionIndex}`}
                  checked={selectedAnswers[currentQuestionIndex] === index}
                  onChange={() => handleAnswerSelect(index)}
                />
                <span className="option-text">{option.text}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="test-navigation">
          <button
            className="btn btn-secondary"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Предыдущий вопрос
          </button>
          
          {isLastQuestion ? (
            <button
              className="btn btn-primary"
              onClick={handleFinish}
              disabled={!hasSelectedAnswer}
            >
              Завершить тест
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleNext}
              disabled={!hasSelectedAnswer}
            >
              Следующий вопрос
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TestPage

