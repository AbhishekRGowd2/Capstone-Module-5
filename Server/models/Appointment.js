const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,  },
  datetime: { type: Date, required: true },
  department: { type: String, required: true },
  report: { type: String }, // file path
  comments: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
