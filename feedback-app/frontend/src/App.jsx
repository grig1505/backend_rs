import { Routes, Route, Link } from 'react-router-dom';
import FeedbackFormPage from './pages/FeedbackFormPage';
import LoginPage from './pages/LoginPage';
import RequestsTablePage from './pages/RequestsTablePage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

const App = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="app">
      <header className="header">
        <nav className="nav">
          <Link to="/">Форма обращения</Link>
          {isAuthenticated && <Link to="/requests">Заявки</Link>}
          {!isAuthenticated && <Link to="/login">Вход оператора</Link>}
          {isAuthenticated && (
            <button onClick={logout} style={{ marginLeft: '1rem' }}>
              Выйти
            </button>
          )}
        </nav>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<FeedbackFormPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/requests"
            element={
              <ProtectedRoute>
                <RequestsTablePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;