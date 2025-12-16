const express = require('express');
const Feedback = require('../models/Feedback');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/feedback - прием заявок с формы
router.post('/', async (req, res) => {
  try {
    const { fullName, phone, problem } = req.body;

    if (!fullName || fullName.trim().length < 3) {
      return res
        .status(400)
        .json({ message: 'ФИО обязательно и должно быть не короче 3 символов' });
    }

    const phoneRegex = /^(\+7|8)\s?\(?\d{3}\)?\s?\d{3}-?\d{2}-?\d{2}$/;
    if (!phone || !phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Неверный формат телефона' });
    }

    if (problem && problem.length > 1000) {
      return res.status(400).json({ message: 'Слишком длинное описание проблемы' });
    }

    const feedback = await Feedback.create({ fullName, phone, problem });
    res.status(201).json({ message: 'Заявка отправлена', feedbackId: feedback._id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// GET /api/feedback - только для авторизованных операторов
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const sort = req.query.sort === 'asc' ? 1 : -1;
    const search = (req.query.search || '').trim();

    const filter = {};
    if (search) {
      filter.fullName = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Feedback.find(filter)
        .sort({ createdAt: sort })
        .skip(skip)
        .limit(limit),
      Feedback.countDocuments(filter),
    ]);

    res.json({
      items,
      total,
      page,
      limit,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;