const mongoose = require('mongoose')

function connect() {
    mongoose.connect(process.env.CAPTAIN_MONGODB_URI).then(()=> {
        console.log('Captain service connected to mongoDB')
    }).catch((error)=> {
       console.error(error)
    })
}

module.exports = connect