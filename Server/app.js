// app.js
const express = require('express');
const bodyParser = require('body-parser');
const appointmentRoutes = require('./routes/appointmentRoutes');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profileRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const cors = require('cors');

const app = express();

app.get("/", (req, res) => {
  res.send(`
    <h1>MediEase API is live</h1>
    <p>Available routes:</p>
    <ul>
      <li><a href="/api/auth/register" target="_blank">Register</a></li>
      <li><a href="/api/auth/login" target="_blank">Login</a></li>
      <li><a href="/api/user/profile/update/123" target="_blank">Update Profile (example)</a></li>
      <li><a href="/api/services" target="_blank">Fetch Services</a></li>
      <li><a href="/api-docs" target="_blank">Swagger Docs</a></li>
    </ul>
  `);
});




app.use(cors({
    origin: ['http://localhost:4000','https://mediease-fh4iavlse-abhishek-r-gowdas-projects.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

app.use(bodyParser.json());

// Mount all routes used in server.js
app.use('/api', appointmentRoutes);
app.use('/api', profileRoutes);
app.use('/api', serviceRoutes);
app.use('/auth', authRoutes); 

module.exports = app;
