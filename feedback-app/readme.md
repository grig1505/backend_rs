Форма: http://localhost:5173/ 
Скрипт создания оператора:
cd backend
node seed-operator.js
Вход: /login (логин operator@clinic.ru, пароль password123).
Таблица заявок: /requests (доступна только после входа).
MongoDB поднял через локальный (openserver) сервер  и открыл через MongoDB Compass
Запуск с корня приложения (поднимает фронт и бэк): npm run start 