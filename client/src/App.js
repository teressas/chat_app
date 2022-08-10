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
  
  //Room State
  const [room, setRoom] = useState("");

  // Messages States
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");

  // const [messagesList, setMessageList] = useState([]); // displays all messages

  // useEffect(() => {
  //   // we need to set up all of our event listeners
  //   // in the useEffect callback function
  //   console.log('Is this running?');
  //   socket.on('Welcome', data => console.log(data));

  //   // note that we're returning a callback function
  //   // this ensures that the underlying socket will be closed if App is unmounted
  //   // this would be more critical if we were creating the socket in a subcomponent
  //   return () => socket.disconnect(true);
  // }, [socket]);

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  const sendMessage = () => {
    socket.emit("send_message", { message, room });
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      // alert(data.message),
      // setMessageList((list)=> {
      //   // console.log(data)
      //   return [...list, data];
      // })
      setMessageReceived(data.message)
    }

    );

    // this ensures that the underlying socket will be closed if App is unmounted
    // this would be more critical if we were creating the socket in a subcomponent
    // return () => socket.disconnect(true);
  }, [socket]);


  return (
    <div className="App">
      <h1>Socket Test</h1>
      <Chat />
      <input
        placeholder="Room Number..."
        onChange={(event) => {
          setRoom(event.target.value);
        }}
      />
      <button onClick={joinRoom}> Join Room</button>
      <br/>
      <input
        placeholder="Message..."
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />
      <button onClick={sendMessage}> Send Message</button>
      <h1> Message:</h1>
      {messageReceived}
    </div>
  );
}

export default App;
