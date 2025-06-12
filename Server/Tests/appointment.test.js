const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // app.js should only contain the appointment route setup
const Appointment = require('../models/Appointment');
const Profile = require('../models/Profile');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

let token, userId;

beforeAll(async () => {
  // Ensure environment variables are set correctly
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';

  // Connect to test DB
  await mongoose.disconnect();
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/testdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Create mock user and generate JWT token
  const user = new User({ email: 'test@example.com', password: 'hashedpw' });
  await user.save();
  userId = user._id;
  token = jwt.sign({ id: userId }, process.env.JWT_SECRET);
});

afterAll(async () => {
  await Appointment.deleteMany({});
  await Profile.deleteMany({});
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('Appointment Controller', () => {
  describe('POST /api/appointments', () => {
    it('should create an appointment with auth token', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${token}`)
        .field('datetime', new Date().toISOString())
        .field('department', 'Cardiology');

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('message', 'Appointment booked successfully');
    });

    it('should fail without auth token', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .send({ datetime: new Date(), department: 'Dermatology' });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'No token provided');
    });
  });

  describe('GET /api/appointments', () => {
    it('should return appointments with profile', async () => {
      await Profile.create({ userId, name: 'John Doe' });

      const res = await request(app)
        .get('/api/appointments')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      if (res.body.length > 0) {
        expect(res.body[0]).toHaveProperty('profile');
      }
    });
  });
});
