require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const feedbackRoutes = require('./routes/feedback');
const authRoutes = require('./routes/auth');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/feedback', feedbackRoutes);
app.use('/api/auth', authRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Маршрут не найден' });
});

app.use((err, req, res, next) => {
  console.error('Unexpected error:', err);
  res.status(500).json({ message: 'Внутренняя ошибка сервера' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));