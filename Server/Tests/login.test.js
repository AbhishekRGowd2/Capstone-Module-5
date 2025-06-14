const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const app = require('../app'); // ✅ server.js includes all routes
const User = require('../models/User');

const testEmail = 'testlogin@example.com';
const testPassword = 'password123';

beforeAll(async () => {
  process.env.JWT_SECRET = 'testsecret'; // ✅ Needed for jwt.sign
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/testdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  await User.deleteMany({ email: testEmail });

  const hashedPassword = await bcrypt.hash(testPassword, 10);
  await User.create({
    email: testEmail,
    password: hashedPassword,
  });
});

afterAll(async () => {
  await User.deleteMany({ email: testEmail });
  await mongoose.connection.close();
});

describe('POST /auth/login', () => {
  it('should login successfully with valid credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: testEmail,
        password: testPassword,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Login successful');
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('email', testEmail);
  });

  it('should fail with wrong password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: testEmail,
        password: 'wrongpassword',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  it('should fail with non-existent user', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'nouser@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'User not found');
  });
});
