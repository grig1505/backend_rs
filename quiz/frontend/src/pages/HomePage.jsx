import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getHistory } from '../services/api'
import './HomePage.css'

function HomePage() {
  const navigate = useNavigate()
  const [history, setHistory] = useState([])

  useEffect(() => {
    setHistory(getHistory())
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const renderProgressBar = (totalQuestions, correctAnswers) => {
    const incorrectAnswers = totalQuestions - correctAnswers
    const segments = []
    
    // Создаем сегменты: сначала правильные (зеленые), потом неправильные (красные)
    for (let i = 0; i < correctAnswers; i++) {
      segments.push({ type: 'correct', index: i })
    }
    for (let i = 0; i < incorrectAnswers; i++) {
      segments.push({ type: 'incorrect', index: i })
    }
    
    return (
      <div className="progress-bar-container">
        <div className="progress-bar" title={`Пройдено ${correctAnswers} из ${totalQuestions}`}>
          <span className="progress-label">0</span>
          <div className="progress-bar-track">
            {segments.map((segment, idx) => (
              <div
                key={idx}
                className={`progress-segment ${segment.type}`}
                style={{ width: `${(100 / totalQuestions)}%` }}
              />
            ))}
          </div>
          <span className="progress-label">{totalQuestions}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="home-page">
      <div className="home-container">
        <h1 className="home-title">Quiz 0.1</h1>
        
        <div className="home-buttons">
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/test')}
          >
            Запустить тест
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/edit')}
          >
            Редактировать тест
          </button>
        </div>

        <div className="history-section">
          <h2 className="history-title">История прохождений</h2>
          {history.length === 0 ? (
            <p className="history-empty">История пуста</p>
          ) : (
            <ul className="history-list">
              {history.map((entry, index) => (
                <li key={index} className="history-item">
                  <div className="history-date">{formatDate(entry.date)}</div>
                  {renderProgressBar(entry.totalQuestions, entry.correctAnswers)}
                  <div className="history-result">
                    Верно: {entry.correctAnswers} из {entry.totalQuestions}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage

