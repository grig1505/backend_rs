# Quiz приложение 0.1

Приложение для проведения тестирования с возможностью редактирования тестов и сохранения истории прохождений.

## Технологии

- **Frontend**: React, Vite, React Router
- **Backend**: Node.js, Express.js
- **База данных**: MongoDB (поднял через Openserver и создал БД через compass mongodb://localhost:27017/quiz )

## Установка и запуск

### Требования

- Node.js (версия 14 или выше)
- MongoDB (запущенный на localhost:27017)

### Быстрый старт

1. Установите все зависимости (в корневой папке quiz):
```bash
npm run install:all
```

2. Запустите оба сервера одновременно:
```bash
npm start
```

Это запустит:
- Backend на `http://localhost:3000`
- Frontend на `http://localhost:5173`

### Ручной запуск (альтернативный способ)

#### Backend

1. Перейдите в папку backend:
```bash
cd backend
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите сервер:
```bash
npm start
```

Или с автоматической перезагрузкой:
```bash
npm run serve
```

Сервер будет доступен на `http://localhost:3000`

#### Frontend

1. В новом терминале перейдите в папку frontend:
```bash
cd frontend
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите dev сервер:
```bash
npm run dev
```

Приложение будет доступно на `http://localhost:5173`

### Сборка для production

Для сборки frontend:
```bash
cd frontend
npm run build
```

Собранные файлы будут в папке `frontend/dist`. Backend автоматически раздает их на порту 3000.

## Структура проекта

```
quiz/
├── backend/          # Express сервер
│   ├── models/       # Mongoose модели
│   ├── routes/       # API маршруты
│   ├── controllers/  # Контроллеры
│   └── server.js     # Точка входа сервера
├── frontend/         # React приложение
│   ├── src/
│   │   ├── pages/    # Страницы приложения
│   │   ├── services/ # API и localStorage сервисы
│   │   └── App.jsx   # Главный компонент
│   └── dist/         # Собранные файлы (после build)
└── package.json      # Корневой package.json с единой командой запуска
```

## API Endpoints

- `GET /api/test` - получить тест
- `PUT /api/test` - обновить тест

## Функциональность

- Прохождение теста с навигацией между вопросами
- Редактирование теста (добавление/удаление вопросов и вариантов ответов)
- История прохождений (сохраняется в localStorage браузера)
- Поддержка множественных правильных ответов

