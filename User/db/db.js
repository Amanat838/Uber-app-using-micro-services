const mongoose = require('mongoose')

function connect() {
    mongoose.connect(process.env.MONGODB_URI).then(()=> {
        console.log('Database connected successfully')
    }).catch((error)=> {
       console.error(error)
    })
}

module.exports = connect