const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const app = require('../app');  // your Express app
const User = require('../models/user');

describe('POST /signup', () => {
  // Test user data
  const testUser = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'TestPass123!',
    contactNumber: '+911234567890',
  };

  // Connect to test DB before all tests
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  // Clean up test user before each test
  beforeEach(async () => {
    await User.deleteMany({ email: testUser.email });
  });

  // Clean up after all tests and close connection
  afterAll(async () => {
    await User.deleteMany({ email: testUser.email });
    await mongoose.connection.close();
  });

  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');

    // Verify user is saved with hashed password
    const userInDb = await User.findOne({ email: testUser.email });
    expect(userInDb).not.toBeNull();
    expect(userInDb.name).toBe(testUser.name);
    expect(userInDb.contactNumber).toBe(testUser.contactNumber);
    // Password should be hashed, so not equal plain text
    expect(userInDb.password).not.toBe(testUser.password);
    const isPasswordCorrect = await bcrypt.compare(testUser.password, userInDb.password);
    expect(isPasswordCorrect).toBe(true);
  });

  it('should not register an existing user', async () => {
    // Pre-create user
    const hashedPassword = await bcrypt.hash(testUser.password, 12);
    await User.create({ ...testUser, password: hashedPassword });

    const res = await request(app)
      .post('/auth/signup')
      .send(testUser);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'User already exists');
  });

  it('should return 500 if server error occurs', async () => {
    // Mock User.findOne to throw error
    jest.spyOn(User, 'findOne').mockImplementationOnce(() => {
      throw new Error('Mock server error');
    });

    const res = await request(app)
      .post('/auth/signup')
      .send(testUser);

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('message', 'Server error during signup');

    // Restore mock
    User.findOne.mockRestore();
  });
});
