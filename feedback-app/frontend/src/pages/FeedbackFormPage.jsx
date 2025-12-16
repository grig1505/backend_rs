import { useState } from 'react';
import axios from 'axios';
import InputMask from 'react-input-mask';

const API_BASE = 'http://localhost:5000';

const FeedbackFormPage = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [problem, setProblem] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validate = () => {
    const errs = {};

    if (!fullName.trim() || fullName.trim().length < 3) {
      errs.fullName = 'Введите ФИО (не менее 3 символов)';
    }

    const phoneRegex = /^(\+7|8)\s?\(?\d{3}\)?\s?\d{3}-?\d{2}-?\d{2}$/;
    if (!phone.trim() || !phoneRegex.test(phone)) {
      errs.phone = 'Введите телефон +7(XXX) XXX-XX-XX';
    }

    if (problem && problem.length > 1000) {
      errs.problem = 'Максимальная длина описания 1000 символов';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await axios.post(`${API_BASE}/api/feedback`, {
        fullName,
        phone,
        problem,
      });

      setSuccessMessage('Ваша заявка успешно отправлена!');
      setFullName('');
      setPhone('');
      setProblem('');
      setErrors({});
    } catch (e) {
      console.error(e);
      setErrorMessage(
        e.response?.data?.message || 'Ошибка при отправке заявки'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page">
      <h1>Форма обращения в клинику</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-field">
          <label>ФИО *</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Иванов Иван Иванович"
          />
          {errors.fullName && <div className="error">{errors.fullName}</div>}
        </div>

        <div className="form-field">
          <label>Номер телефона *</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+7 (___) ___-__-__ или 8XXXXXXXXXX"
          />
          {errors.phone && <div className="error">{errors.phone}</div>}
        </div>

        <div className="form-field">
          <label>Опишите вашу проблему</label>
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            rows={5}
            placeholder="Опишите симптомы или ваш вопрос"
          />
          {errors.problem && <div className="error">{errors.problem}</div>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Отправка...' : 'Отправить'}
        </button>

        {successMessage && (
          <div className="success" style={{ marginTop: '1rem' }}>
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="error" style={{ marginTop: '1rem' }}>
            {errorMessage}
          </div>
        )}
      </form>
    </div>
  );
};

export default FeedbackFormPage;