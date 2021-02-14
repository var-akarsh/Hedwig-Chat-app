const path = require('path')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const {generateMessage,generateLocationMessage} = require('../src/utils/messages')
const {addUser,removeUser,getUser,getUsersinRoom} = require('./utils/users')
const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 8080
const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))


io.on('connection', (socket) => {
    console.log('Web socket connection')

    socket.on('join',({username,room},callback)=>{
        const {user,error}= addUser({id:socket.id,username,room})
        
        if(error){
            return callback(error)
        }

        socket.join(user.room)
        socket.emit('message', generateMessage(user.username,'Welcome'))
        socket.broadcast.to(user.room).emit('message', generateMessage(user.username,`${user.username} has joined!`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersinRoom(user.room)
        })
    })
    
    socket.on('sendmessage', (message, callback) => {
        const user= getUser(socket.id)

        io.to(user.room).emit('message', generateMessage(user.username,message))
        callback()
    })
    socket.on('sendlocation', (coord, callback) => {
        const user= getUser(socket.id)
        io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`https://www.google.com/maps?q=${coord.latitude},${coord.longitude}`))
        callback()
    })
   

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMessage(user.username,`${user.username} 'has left!'`))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersinRoom(user.room)
            })
        }
    })

    
})

server.listen(port, () => {
    console.log('Server is up on port ' + port + '...')
})