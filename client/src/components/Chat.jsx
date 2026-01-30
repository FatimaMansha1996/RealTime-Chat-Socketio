import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./Chat.css";

// Connect to backend Socket.io server
const socket = io("http://localhost:5000");

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Temporary username for this client
  const username = "You";

  // Listen for messages from server
  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);

      // Auto-scroll to the latest message
      const messageBox = document.getElementById("messageBox");
      if (messageBox) {
        messageBox.scrollTop = messageBox.scrollHeight;
      }
    });

    // Clean up the socket listener on unmount
    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  // Send message to server
  const sendMessage = () => {
    if (message.trim() === "") return;

    // Emit message with username
    socket.emit("sendMessage", { username, text: message });
    setMessage(""); // Clear input field
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        <h2>Real-Time Chat</h2>

        <div className="message-box" id="messageBox">
          {messages.map((msg, index) => (
            <div
              key={index}
              className="message"
              style={{
                backgroundColor:
                  msg.username === username ? "#007bff" : "#e0f7fa",
                color: msg.username === username ? "white" : "black",
                alignSelf:
                  msg.username === username ? "flex-end" : "flex-start",
              }}
            >
              <strong>{msg.username}: </strong>
              {msg.text}
            </div>
          ))}
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
