const Profile = require('../models/Profile');
const path = require('path');

// GET /profile
const getProfile = async (req, res) => {
  try {
    console.log("Fetching profile for:", req.user);
    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /profile (create or update)
const createOrUpdateProfile = async (req, res) => {
  const {
    firstName, lastName, phone, email,
    address1, address2, city, state, zipcode
  } = req.body;

  const profileData = {
    firstName, lastName, phone, email,
    address1, address2, city, state, zipcode
  };

  if (req.file) {
    profileData.profilePic = req.file.filename; // store the filename
  }

  try {
    let profile = await Profile.findOne({ userId: req.user.id });

    if (profile) {
      // update
      profile = await Profile.findOneAndUpdate(
        { userId: req.user.id },
        { $set: profileData },
        { new: true }
      );
    } else {
      // create
      profile = new Profile({
        userId: req.user.id,
        ...profileData
      });
      await profile.save();
    }

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {getProfile, createOrUpdateProfile};