const Appointment = require('../models/Appointment');
const Profile = require('../models/Profile'); // assuming this is your profile model

const createAppointment = async (req, res) => {
  try {
    const { datetime, department, comments } = req.body;
    const report = req.file?.path || null;
    const userId = req.user.id; // from auth middleware

    if (!datetime || !department) {
      return res.status(400).json({ message: 'Date/Time and Department are required' });
    }

    const appointment = new Appointment({
      userId,
      datetime,
      department,
      comments,
      report
    });

    await appointment.save();
    res.status(201).json({ message: 'Appointment booked successfully' });
  } catch (err) {
    console.error('Appointment creation error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


const getAppointments = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch appointments for this user
    const appointments = await Appointment.find({ userId }).sort({ datetime: -1 }).lean();

    // Fetch the profile for this user
    const profile = await Profile.findOne({ userId }).lean();

    // Merge profile data into each appointment object
    const enrichedAppointments = appointments.map(appointment => ({
      ...appointment,
      profile: profile || null
    }));

    res.status(200).json(enrichedAppointments);
  } catch (err) {
    console.error('Error fetching appointments with profiles:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



module.exports={createAppointment,getAppointments};