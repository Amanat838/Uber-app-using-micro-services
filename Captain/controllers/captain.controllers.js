const captainModel = require('../models/captain.models.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const blacklisttokenModel = require('../models/blacklisttoken.model')
const {subscribeToQueue} = require('../service/rabbit.js')


module.exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const captain = await captainModel.findOne({ email })
        if (captain) {
            return res.status(400).json({ message: 'captain already present' })
        }
        const hash = await bcrypt.hash(password, 10)
        console.log('hashed password', hash)
        const newCaptain = new captainModel({ name, email, password: hash })
        await newCaptain.save()
        const token = jwt.sign({ id: newCaptain._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.cookie('token', token)
        delete newCaptain._doc.password
        res.send({ token, newCaptain })
    } catch (error) {
        console.log(error)
    }
}

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        const captain = await captainModel.findOne({ email }).select('+password')
        console.log('fetched captain', captain)
        if (!captain) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }
        const isMatch = await bcrypt.compare(password, captain.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }
        delete captain._doc.password
        const token = jwt.sign({ id: captain._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.cookie('token', token)
        res.send({ token, captain })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports.logout = async (req, res) => {
    try {
        const token = req.cookies.token
        await blacklisttokenModel.create({ token })
        res.clearCookie('token')
        res.send({ message: 'captain logged out successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports.profile = async (req, res) => {
    try {
        res.send(req.captain)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports.toggleAvailability = async (req, res) => {
    try {
        const captain = await captainModel.findById(req.captain._id)
        captain.isAvailable = !captain.isAvailable
        await captain.save()
        res.send(captain)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

subscribeToQueue('new-ride', (data)=> {
    console.log(JSON.parse(data))
})