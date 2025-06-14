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
    origin: [['http://localhost:4000','https://mediease-eju0wc6sf-abhishek-r-gowdas-projects.vercel.app']],
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
