import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./Chat.css";

// Connect to backend Socket.io server
const socket = io("http://localhost:5000");

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Listen for messages from server
  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);

      // Auto-scroll to latest message
      const messageBox = document.getElementById("messageBox");
      if (messageBox) {
        messageBox.scrollTop = messageBox.scrollHeight;
      }
    });

    return () => socket.off("receiveMessage");
  }, []);

  // Send message
  const sendMessage = () => {
    if (message.trim() === "") return;

    socket.emit("sendMessage", {
      text: message,
      senderId: socket.id, // 👈 unique per client
    });

    setMessage("");
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        <h2>Real-Time Chat</h2>

        <div className="message-box" id="messageBox">
          {messages.map((msg, index) => {
            const isMine = msg.senderId === socket.id;

            return (
              <div
                key={index}
                className={`message ${isMine ? "my-message" : "other-message"}`}
              >
                <strong>{isMine ? "You" : "User"}:</strong> {msg.text}
              </div>
            );
          })}
        </div>

        <div className="input-container">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}
