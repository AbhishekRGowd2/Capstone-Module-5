// controllers/serviceController.js
const Service = require('../models/Services');

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
