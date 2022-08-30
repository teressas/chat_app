import React, { useEffect, useState } from 'react'

const Chat = ({ socket, username, room }) => {
    // Messages States
    const [currmsg, setCurrmsg] = useState("");
    const [messageList, setMessageList] = useState([]);

    // send the msg data to the server, set the messagelist with the prev msgs and the curr msg
    const sendMessage = async () => {
        if (currmsg !== "") {
            let messageData = {
                room: room,
                author: username,
                message: currmsg,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            };
            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrmsg("");
        }

    };

    // returns the new msg with prev msgs on re-render
    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });

        // this ensures that the underlying socket will be closed if App is unmounted
        // this would be more critical if we were creating the socket in a subcomponent
        return () => socket.disconnect(true);
    }, [socket]);


    return (
        <div>
            <div className="chat-header">
                <p>Live Chat</p>
            </div>
            <div className="chat-body">
                <div className="message-container">
                    {
                        messageList.map((messageContent) => {
                            return (
                                <div className="message" id={username === messageContent.author ? "you" : "other"}>
                                    <div>
                                        <div className="message-content">
                                            <p>{messageContent.message}</p>
                                        </div>
                                        <div className="message-meta">
                                            <p id="time">{messageContent.time}</p>
                                            <p id="author">{messageContent.author}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
            <div className="chat-footer">
                <input 
                    type="text" 
                    value={currmsg} 
                    placeholder="Enter Message..." 
                    onChange={(event) => { 
                        setCurrmsg(event.target.value); 
                    }}
                    onKeyPress={(event) => { event.key === "Enter" && sendMessage(); }}
                />
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    )
}

export default Chat