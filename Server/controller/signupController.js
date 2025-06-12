const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.signup = async (req, res) => {
  try {
    const { name, email, password, contactNumber } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      contactNumber
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ message: 'Server error during signup' });
  }
};



exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.id; // assuming you get user ID from auth middleware
    const { name, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    );

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
