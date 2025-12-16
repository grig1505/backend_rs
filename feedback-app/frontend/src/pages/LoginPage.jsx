import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:5000';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Введите email и пароль');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, {
        email,
        password,
      });

      login(res.data.token);
      navigate('/requests');
    } catch (e) {
      console.error(e);
      setErrorMessage(
        e.response?.data?.message || 'Ошибка входа. Проверьте данные'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page">
      <h1>Вход для операторов</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-field">
          <label>Email</label>
          <input
            type="email"
            placeholder="operator@clinic.ru"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Пароль</label>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Вход...' : 'Войти'}
        </button>

        {errorMessage && (
          <div className="error" style={{ marginTop: '1rem' }}>
            {errorMessage}
          </div>
        )}
      </form>
    </div>
  );
};

export default LoginPage;