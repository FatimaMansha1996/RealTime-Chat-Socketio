import { useState, useEffect } from "react";
import { io } from "socket.io-client";

// Connect to backend Socket.io server
const socket = io("http://localhost:5000");

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Listen for messages from server
  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Clean up the socket on unmount
    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  // Send message to server
  const sendMessage = () => {
    if (message.trim() === "") return;

    socket.emit("sendMessage", message);
    setMessage(""); // clear input
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Real-Time Chat</h2>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "300px",
          overflowY: "scroll",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        style={{ width: "80%", padding: "5px" }}
      />
      <button onClick={sendMessage} style={{ padding: "5px 10px", marginLeft: "5px" }}>
        Send
      </button>
    </div>
  );
}
