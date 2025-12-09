import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTest, updateTest } from '../services/api'
import './EditPage.css'

function EditPage() {
  const navigate = useNavigate()
  const [test, setTest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

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
      setError('Не удалось загрузить тест')
      setLoading(false)
    }
  }

  const handleQuestionTextChange = (questionIndex, text) => {
    const updatedQuestions = [...test.questions]
    updatedQuestions[questionIndex].text = text
    setTest({ ...test, questions: updatedQuestions })
  }

  const handleOptionTextChange = (questionIndex, optionIndex, text) => {
    const updatedQuestions = [...test.questions]
    updatedQuestions[questionIndex].options[optionIndex].text = text
    setTest({ ...test, questions: updatedQuestions })
  }

  const handleOptionCorrectChange = (questionIndex, optionIndex) => {
    const updatedQuestions = [...test.questions]
    updatedQuestions[questionIndex].options[optionIndex].isCorrect = 
      !updatedQuestions[questionIndex].options[optionIndex].isCorrect
    setTest({ ...test, questions: updatedQuestions })
  }

  const handleAddOption = (questionIndex) => {
    const updatedQuestions = [...test.questions]
    updatedQuestions[questionIndex].options.push({
      text: 'Новый вариант ответа',
      isCorrect: false
    })
    setTest({ ...test, questions: updatedQuestions })
  }

  const handleRemoveOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...test.questions]
    if (updatedQuestions[questionIndex].options.length > 1) {
      updatedQuestions[questionIndex].options.splice(optionIndex, 1)
      setTest({ ...test, questions: updatedQuestions })
    }
  }

  const handleAddQuestion = () => {
    const updatedQuestions = [...test.questions]
    updatedQuestions.push({
      text: 'Новый вопрос',
      options: [
        { text: 'Вариант ответа 1', isCorrect: true },
        { text: 'Вариант ответа 2', isCorrect: false }
      ]
    })
    setTest({ ...test, questions: updatedQuestions })
  }

  const handleRemoveQuestion = (questionIndex) => {
    const updatedQuestions = [...test.questions]
    if (updatedQuestions.length > 1) {
      updatedQuestions.splice(questionIndex, 1)
      setTest({ ...test, questions: updatedQuestions })
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)

    try {
      // Валидация
      for (let i = 0; i < test.questions.length; i++) {
        const question = test.questions[i]
        if (!question.text || question.text.trim() === '') {
          setError(`Вопрос ${i + 1}: текст вопроса не может быть пустым`)
          setSaving(false)
          return
        }
        if (question.options.length === 0) {
          setError(`Вопрос ${i + 1}: должен содержать хотя бы один вариант ответа`)
          setSaving(false)
          return
        }
        for (let j = 0; j < question.options.length; j++) {
          const option = question.options[j]
          if (!option.text || option.text.trim() === '') {
            setError(`Вопрос ${i + 1}, вариант ${j + 1}: текст варианта не может быть пустым`)
            setSaving(false)
            return
          }
        }
        const hasCorrectAnswer = question.options.some(opt => opt.isCorrect === true)
        if (!hasCorrectAnswer) {
          setError(`Вопрос ${i + 1}: должен иметь хотя бы один правильный ответ`)
          setSaving(false)
          return
        }
      }

      await updateTest({ questions: test.questions })
      navigate('/')
    } catch (error) {
      console.error('Ошибка сохранения:', error)
      setError(error.response?.data?.error || 'Не удалось сохранить тест')
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="edit-page">Загрузка...</div>
  }

  if (!test) {
    return (
      <div className="edit-page">
        <div className="edit-container">
          <p>Не удалось загрузить тест.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Назад
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="edit-page">
      <div className="edit-container">
        <h1 className="edit-title">Редактирование теста</h1>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="questions-list">
          {test.questions.map((question, questionIndex) => (
            <div key={questionIndex} className="question-block">
              <div className="question-header">
                <h3 className="question-number">Вопрос {questionIndex + 1}</h3>
                {test.questions.length > 1 && (
                  <button
                    className="btn-remove"
                    onClick={() => handleRemoveQuestion(questionIndex)}
                    title="Удалить вопрос"
                  >
                    ✕
                  </button>
                )}
              </div>

              <input
                type="text"
                className="question-input"
                value={question.text}
                onChange={(e) => handleQuestionTextChange(questionIndex, e.target.value)}
                placeholder="Текст вопроса"
              />

              <div className="options-list">
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="option-row">
                    <input
                      type="text"
                      className="option-input"
                      value={option.text}
                      onChange={(e) => handleOptionTextChange(questionIndex, optionIndex, e.target.value)}
                      placeholder="Текст варианта ответа"
                    />
                    <label className="correct-checkbox">
                      <input
                        type="checkbox"
                        checked={option.isCorrect}
                        onChange={() => handleOptionCorrectChange(questionIndex, optionIndex)}
                      />
                      <span>Правильный</span>
                    </label>
                    {question.options.length > 1 && (
                      <button
                        className="btn-remove-small"
                        onClick={() => handleRemoveOption(questionIndex, optionIndex)}
                        title="Удалить вариант"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                className="btn btn-add-option"
                onClick={() => handleAddOption(questionIndex)}
              >
                + Добавить вариант ответа
              </button>
            </div>
          ))}
        </div>

        <button
          className="btn btn-add-question"
          onClick={handleAddQuestion}
        >
          + Добавить вопрос
        </button>

        <div className="edit-actions">
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/')}
            disabled={saving}
          >
            Назад
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditPage

