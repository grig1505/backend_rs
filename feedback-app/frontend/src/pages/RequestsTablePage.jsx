import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:5000';

const formatDateTime = (iso) => {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}.${mm}.${yyyy} ${hh}:${min}`;
};

const RequestsTablePage = () => {
  const { token } = useAuth();

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(id);
  }, [searchQuery]);

  const fetchData = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await axios.get(`${API_BASE}/api/feedback`, {
        params: {
          page,
          limit,
          sort: sortOrder,
          search: debouncedSearch || undefined,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setItems(res.data.items || []);
      setTotal(res.data.total || 0);
    } catch (e) {
      console.error(e);
      setErrorMessage(
        e.response?.data?.message || 'Ошибка при загрузке заявок'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortOrder, debouncedSearch, token]);

  const totalPages = Math.ceil(total / limit) || 1;

  const toggleSort = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const goPrev = () => {
    setPage((p) => Math.max(1, p - 1));
  };

  const goNext = () => {
    setPage((p) => Math.min(totalPages, p + 1));
  };

  return (
    <div className="page">
      <h1>Таблица заявок</h1>

      <div className="toolbar" style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Поиск по ФИО"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginRight: '1rem' }}
        />
        <span>Всего заявок: {total}</span>
      </div>

      {isLoading && <div>Загрузка...</div>}
      {errorMessage && <div className="error">{errorMessage}</div>}

      {!isLoading && items.length === 0 && !errorMessage && (
        <div>Заявок нет</div>
      )}

      {!isLoading && items.length > 0 && (
        <>
          <table className="table">
            <thead>
              <tr>
                <th onClick={toggleSort} style={{ cursor: 'pointer' }}>
                  Дата отправки {sortOrder === 'asc' ? '▲' : '▼'}
                </th>
                <th>ФИО</th>
                <th>Телефон</th>
                <th>Проблема</th>
              </tr>
            </thead>
            <tbody>
              {items.map((f) => (
                <tr key={f._id}>
                  <td>{formatDateTime(f.createdAt)}</td>
                  <td>{f.fullName}</td>
                  <td>{f.phone}</td>
                  <td>{f.problem}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination" style={{ marginTop: '1rem' }}>
            <button onClick={goPrev} disabled={page === 1}>
              Назад
            </button>
            <span style={{ margin: '0 1rem' }}>
              Страница {page} из {totalPages}
            </span>
            <button onClick={goNext} disabled={page === totalPages}>
              Вперёд
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RequestsTablePage;