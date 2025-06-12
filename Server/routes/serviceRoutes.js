// routes/serviceRoutes.js
const express = require('express');
const router = express.Router();
const { getAllServices } = require('../controller/serviceController');

/**
 * @swagger
 * /api/services:
 *   get:
 *     tags:
 *       - Services
 *     summary: Get all services
 *     description: Retrieve a list of all available services
 *     responses:
 *       200:
 *         description: A list of services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server error
 *
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64f8a6aafea1aeb8f21d1234
 *         name:
 *           type: string
 *           example: General Consultation
 *         description:
 *           type: string
 *           example: Consult with a general physician for basic health concerns.
 *         price:
 *           type: number
 *           example: 500
 *         duration:
 *           type: number
 *           description: Duration in minutes
 *           example: 30
 */


router.get('/services', getAllServices);

module.exports = router;
