const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const Filter = require('bad-words');
const { createMessages } = require('./utils/create-message');
const { getUserList, addUser, removeUser } = require('./utils/users');

// app
const app = express();

// static files
const publicPathDirectory = path.join(__dirname, '../public');
app.use(express.static(publicPathDirectory));

// server
const server = http.createServer(app);

// socket IO
const io = new Server(server);
// listen connections events from client
io.on('connection', (socket) => {
    console.log('new connection');

    // join room chat
    socket.on('client_joinChat', ({ room, username }) => {
        // room
        socket.join(room);

        // a new client connection
        socket.emit('server_joinChat', `Welcome to room ${room}`);

        // send another client
        socket.broadcast
            .to(room)
            .emit('server_joinChat', `${username} joined the chat`);

        // chat
        socket.on('client_sendMessage', (message, callback) => {
            const filter = new Filter();

            if (filter.isProfane(message)) {
                callback('Invalid message');
                io.to(room).emit(
                    'server_sendMessage',
                    filter.clean(createMessages(message, username, socket.id))
                );
            } else {
                io.to(room).emit(
                    'server_sendMessage',
                    createMessages(message, username, socket.id)
                );
                callback('message sent successfully');
            }
        });
        // location
        socket.on('client_sendLocation', ({ latitude, longitude }) => {
            const urlLocation = `https://www.google.com/maps?q=${latitude},${longitude}`;
            io.to(room).emit(
                'server_sendLocation',
                createMessages(urlLocation, username, socket.id)
            );
        });

        // user list
        const newUser = {
            id: socket.id,
            room,
            username,
        };
        addUser(newUser);
        io.to(room).emit('server_getUserList', getUserList(room));

        // client disconnect
        socket.on('disconnect', () => {
            removeUser(socket.id);
            io.to(room).emit('server_getUserList', getUserList(room));
        });
    });

    /*
    io.emit('sendCount', count);
    
    // get a request from client
    socket.on('send increment from client to server', () => {
        count++;
        io.emit('sendCount', count);
    });
    
    // get data form client (chat message)
    socket.on('send message', (message) => {
        io.emit('message', message);
    });
*/
});

// port
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}/`);
});
