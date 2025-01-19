const rideModel = require('../models/ride.models')
const {publishToQueue} = require('../service/Rabbit')

module.exports.createRide = async (req, res, next) => {
    try {
        const {pickup, destination} = req.body

        const newRide = new rideModel({
            user: req.user._id,
            pickup,
            destination
        })
        
        await newRide.save()
        publishToQueue('new-ride', JSON.stringify(newRide))
        res.send(newRide)
    } catch (error) {
        
    }
}