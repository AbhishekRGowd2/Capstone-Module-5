// app.js
const express = require('express');
const bodyParser = require('body-parser');
const appointmentRoutes = require('./routes/appointmentRoutes');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profileRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: [['http://localhost:4000','https://mediease-3vik7f6p4-abhishek-r-gowdas-projects.vercel.app']],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send(`
    <h1>🩺 MediEase Backend is Running</h1>
    <p>Welcome to the MediEase API. Here are some useful endpoints:</p>
    <ul>
      <li><a href="/api/appointments">/api/appointments</a> - View all appointments (GET)</li>
      <li><a href="/api/services">/api/services</a> - View all services (GET)</li>
      <li><a href="/api-docs">/api-docs</a> - API Documentation (Swagger or similar)</li>
    </ul>
  `);
});


// Mount all routes used in server.js
app.use('/api', appointmentRoutes);
app.use('/api', profileRoutes);
app.use('/api', serviceRoutes);
app.use('/auth', authRoutes); 

module.exports = app;
