const jwt = require('jsonwebtoken')
const captainModel = require('../models/captain.models')
const blacklisttokenModel = require('../models/blacklisttoken.model')
module.exports.captainAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization.split[' '][1]
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        const isBlackListed = await blacklisttokenModel.find({ token })
        if (isBlackListed.length) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        const captain = await captainModel.findById(decode.id)
        if (!captain) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        req.captain = captain
        next()
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}