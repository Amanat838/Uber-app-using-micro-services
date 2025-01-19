const http = require('http')
const app = require('./App')


const server = http.createServer(app)


server.listen(3002, ()=> {
    console.log('Captain service listening at port 3002')
})