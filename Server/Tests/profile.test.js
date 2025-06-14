// Tests/profile.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // full app with routes and auth middleware
const Profile = require('../models/Profile');
const User = require('../models/User');

let token;
const testUser = {
  email: 'profiletest@example.com',
  password: 'password123'
};

beforeAll(async () => {
  process.env.JWT_SECRET = 'testsecret';

  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/testdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await User.deleteMany({ email: testUser.email });

  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash(testUser.password, 10);
  const createdUser = await User.create({ email: testUser.email, password: hashedPassword });

  const res = await request(app)
    .post('/auth/login')
    .send({ email: testUser.email, password: testUser.password });

  console.log("Login Response", res.body);

  token = res.body.token;
  if (!token) throw new Error("Login did not return a token");
});


afterAll(async () => {
  await User.deleteMany({ email: testUser.email });
  await Profile.deleteMany({ userId: new mongoose.Types.ObjectId() }); // Clean profiles of test user
  await mongoose.connection.close();
});

describe('Profile API', () => {
  it('GET /api/profile should return 404 if no profile exists', async () => {
    const res = await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Profile not found');
  });

  it('POST /api/profile should create a new profile', async () => {
    const res = await request(app)
      .post('/api/profile')
      .set('Authorization', `Bearer ${token}`)
      .field('firstName', 'John')
      .field('lastName', 'Doe')
      .field('phone', '1234567890')
      .field('email', testUser.email)
      .field('address1', '123 Main St')
      .field('city', 'Sample City')
      .field('state', 'Sample State')
      .field('zipcode', '12345');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('firstName', 'John');
    expect(res.body).toHaveProperty('lastName', 'Doe');
    expect(res.body).toHaveProperty('email', testUser.email);
  });

  it('GET /api/profile should return profile after creation', async () => {
    const res = await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('firstName', 'John');
  });

  it('POST /api/profile should update an existing profile', async () => {
    const res = await request(app)
      .post('/api/profile')
      .set('Authorization', `Bearer ${token}`)
      .field('firstName', 'Jane')
      .field('lastName', 'Doe');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('firstName', 'Jane');
    expect(res.body).toHaveProperty('lastName', 'Doe');
  });
});
