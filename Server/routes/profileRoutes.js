const express = require('express');
const router = express.Router();
const path = require('path');


const authenticate = require('../Middleware/authenticate'); // middleware that sets req.user
const { getProfile, createOrUpdateProfile} = require('../controller/profileController');
const multer = require('multer');

// configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/profile-pics'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}_${file.fieldname}${ext}`);
  }
});
const upload = multer({ storage });


/**
 * @swagger
 * /api/profile:
 *   get:
 *     tags:
 *       - Profile
 *     summary: Get logged-in user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile not found
 *   post:
 *     tags:
 *       - Profile
 *     summary: Create or update logged-in user's profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               address1:
 *                 type: string
 *               address2:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zipcode:
 *                 type: string
 *               profilePic:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile created or updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       500:
 *         description: Server error
 */


// Routes
router.get('/test', (req, res) => res.send('Profile route is working'));
router.get("/profile", authenticate, getProfile);
router.post('/profile', authenticate, upload.single('profilePic'), createOrUpdateProfile);

module.exports = router;
