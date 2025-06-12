const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Service = require('../models/Services');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/testdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  // Clear previous data
  await Service.deleteMany({});

  // Insert sample services with all required fields
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

afterAll(async () => {
  await Service.deleteMany({});
  await mongoose.connection.close();
});

describe('GET /api/services', () => {
  it('should return all services', async () => {
    const res = await request(app).get('/api/services');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);

    // Check first item has required fields
    expect(res.body[0]).toHaveProperty('service');
    expect(res.body[0]).toHaveProperty('serviceImagePath');
  });
});
