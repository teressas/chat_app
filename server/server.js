// server.js
const express = require('express');
const app = express();

// req is shorthand for request
// res is shorthand for response
// app.get("/api", (req, res) => {
//     res.json({ message: "Hello World" });
// });

const server = app.listen(8000, () =>
    console.log('The server is all fired up on port 8000')
);

// To initialize the socket, we need to
// invoke the socket.io library
// and pass it our Express server
const io = require('socket.io')(server, { cors: true });

io.on('connection', socket => {
    // NOTE: Each client that connects get their own socket id!
    console.log(socket.id, "", "Nice to meet you 🤝 ");
    socket.emit("hello","world")
    // if this is logged in our node terminal, that means a new client has successfully completed the handshake!
    // We add all of our additional event listeners right inside this function.
    // NOTE "connection" is a BUILT IN event listeners.

    /* socket.on will listen for an event from the client.
    It takes a callback function that contains the data from the client
    We then send that data straight to all the other clients.*/
    socket.on("event_from_client", data => {
        /* socket.broadcast will emit to all other clients besides the client who is actually emitting
        Other events: 
        1. io.emit - emits an event to all connected clients
        2. socket.emit - emits an event directly to this specific client
        3. socket.broadcast.emit - emits an event to all clients other than this particular one, referenced by the socket variable
        */
        socket.broadcast.emit("send_data_to_all_other_clients", data);
    });
});
