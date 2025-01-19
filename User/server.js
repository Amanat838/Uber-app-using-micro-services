const http = require('http')
const app = require('./App')


const server = http.createServer(app)


server.listen(3001, ()=> {
    console.log('User service listening at port 3001')
})