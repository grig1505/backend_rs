const User = require('./models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('./constants');

async function addUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({email, password: hashedPassword});
}

async function loginUser(email, password) {
  const user = await User.findOne({email});
  if(!user){
    throw new Error('User not found');
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if(!isPasswordCorrect){
    throw new Error('Invalid password');
  }
  return jwt.sign({ email }, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

}

module.exports = {
  addUser,
  loginUser
}