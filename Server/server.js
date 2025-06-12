// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieSession = require('cookie-session');
const passport = require('passport');
require('./config/passport');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const app = require('./app'); // Import the app (from app.js)

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());

app.use(cookieSession({
  name: "session",
  keys: [process.env.JWT_SECRET],
  maxAge: 24 * 60 * 60 * 1000
}));

app.use(passport.initialize());
app.use(passport.session());

// Serve Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use('/images', express.static('public/images'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
