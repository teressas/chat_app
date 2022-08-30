// server.js
const express = require('express');
const app = express();
// socket.io is created upon an http server, recommended way in documentation: https://socket.io/docs/v4/server-initialization/#with-express
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

app.use(cors());

const server = http.createServer(app);

// To initialize the socket, we need to
// invoke the socket.io library
// and pass it our Express server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

// const io = require('socket.io')(server, { cors: true });

// We add all of our additional event listeners right inside this function.
// NOTE "connection" is a BUILT IN event listeners.
io.on('connection', (socket) => {
    // NOTE: Each client that connects get their own socket id!
    // if this is logged in our node terminal, that means a new client has successfully completed the handshake!
    console.log("A client connected:", socket.id);
    //     socket.emit("Nice to meet you 🤝 ")

    /* socket.on will listen for an event from the client.
    It takes a callback function that contains the data from the client
    We then send that data straight to all the other clients.*/

    // join a room and listens for room sent from client
    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on("send_message", (data) => { // from send message funct on client
        console.log(data)
        socket.to(data.room).emit("receive_message", data); // specify room and then send msg
        // socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });

});
/* socket.broadcast will emit to all other clients besides the client who is actually emitting
        Other events: 
        1. io.emit - emits an event to all connected clients
        2. socket.emit - emits an event directly to this specific client
        3. socket.broadcast.emit - emits an event to all clients other than this particular one, referenced by the socket variable
        */


server.listen(8000, () =>
    console.log('The server is all fired up on port 8000')
);