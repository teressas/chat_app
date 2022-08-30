import './App.css';
import io from 'socket.io-client';
import React, { useState, useEffect } from 'react';
import Chat from '../src/components/Chat';

/* alternative way to connect to socket.io-client
remove socket dependencies setMessages useEffect call */
// const socket = io.connect("http://localhost:8000");

function App() {

  // notice that we pass a callback function to initialize the socket
  // we don't need to destructure the 'setSocket' function since we won't be updating the socket state
  const [socket] = useState(() => io(':8000'));

  // create username and room use state vars
  const [username , setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  // join room and show chat
  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div>
          <h3>Join A Chat</h3>
          <input type="text" placeholder="Enter Name..." onChange={(event) => { setUsername(event.target.value); }} />
          <input type="text" placeholder="Room ID..." onChange={(event) => { setRoom(event.target.value); }} /> 
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
      
    </div>
  );
}

export default App;
