const express = require('express');
const router = express.Router();
const { createAppointment, getAppointments } = require('../controller/appointmentcontroller');
const authenticate = require('../Middleware/authenticate');
const upload = require('../Middleware/upload');

// POST /api/appointments
getAppointments

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Appointment management
 */

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Create an appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - datetime
 *               - department
 *             properties:
 *               datetime:
 *                 type: string
 *                 format: date-time
 *               department:
 *                 type: string
 *               comments:
 *                 type: string
 *               report:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Appointment booked successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 *   get:
 *     summary: Get all appointments for the logged-in user
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of appointments with profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   datetime:
 *                     type: string
 *                     format: date-time
 *                   department:
 *                     type: string
 *                   comments:
 *                     type: string
 *                   report:
 *                     type: string
 *                   profile:
 *                     type: object
 *                     description: Profile details of user
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */


router.post('/appointments', authenticate, upload.single('report'), createAppointment);
router.get('/appointments', authenticate, getAppointments);
module.exports = router;
