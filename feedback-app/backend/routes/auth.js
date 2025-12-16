const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Operator = require('../models/Operator');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email и пароль обязательны' });
    }

    const operator = await Operator.findOne({ email });
    if (!operator) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    const isMatch = await bcrypt.compare(password, operator.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    const token = jwt.sign(
      { id: operator._id, email: operator.email },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '8h' }
    );

    res.json({ token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;