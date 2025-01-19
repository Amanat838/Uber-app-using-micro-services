const http = require('http')
const app = require('./app')
const server = http.createServer(app)



server.listen(3003, ()=> {
    console.log('Ride service is listening at port 3003')
})