require('dotenv').config();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Operator = require('./models/Operator');

const run = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/feedback', {
    //  useNewUrlParser: true,
    //  useUnifiedTopology: true,
    });

    const email = 'operator@clinic.ru';
    const password = 'password123';

    const passwordHash = await bcrypt.hash(password, 10);

    const existing = await Operator.findOne({ email });
    if (existing) {
      console.log('Оператор уже существует');
    } else {
      await Operator.create({ email, passwordHash });
      console.log('Оператор создан:', email, 'пароль:', password);
    }

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

run();