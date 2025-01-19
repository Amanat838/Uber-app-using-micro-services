const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/auth.middlewares')
const rideController = require('../controllers/ride.controllers')


router.post('/create-ride', authMiddleware.userAuth, rideController.createRide)

module.exports = router