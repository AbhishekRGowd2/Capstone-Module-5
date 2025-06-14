const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Service = require('../models/Services');

// Connect to the database before any tests run
beforeAll(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB', err);
  }
});

// Clean and seed the database before each test
beforeEach(async () => {
  await Service.deleteMany();

  await Service.insertMany([
    {
      service: 'General Consultation',
      serviceImagePath: 'general-consult.jpg',
      description: 'Consult with a general physician',
      price: 500,
      duration: 30,
    },
    {
      service: 'Dental Checkup',
      serviceImagePath: 'dental-checkup.jpg',
      description: 'Basic dental checkup and cleaning',
      price: 700,
      duration: 45,
    },
  ]);
});

// Disconnect after all tests are done
afterAll(async () => {
  await Service.deleteMany(); // optional
  await mongoose.connection.close();
});

describe('GET /api/services', () => {
  it('should return all services with required fields', async () => {
    const res = await request(app).get('/api/services');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);

    res.body.forEach((item) => {
      expect(item).toHaveProperty('service');
      expect(item).toHaveProperty('serviceImagePath');
    });
  });
});
