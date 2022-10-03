import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import MessageUI from "./components/MessageUI";
import JoinOrCreate from "./components/JoinOrCreate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [typingUrl, setTypingUrl] = useState("");
  const [socket, setSocket] = useState<WebSocket>();
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  const websocketUrl = process.env.REACT_APP_WS_URL;

  const websocketConnect = () => {
    if (!websocketUrl) return;

    const ws = new WebSocket(websocketUrl);
    setSocket(ws);
  };

  useEffect(() => {
    websocketConnect();
  }, []);

  socket?.addEventListener("message", function (event) {
    try {
      const messageData = JSON.parse(event.data);

      if (messageData.type === "err") {
        toast(messageData.message);
        setJoined(false);
        return;
      }

      setMessages([...messages, messageData]);
    } catch (error) {
      setMessages([...messages, event.data]);
    }
  });
  socket?.addEventListener("close", function (event) {
    setSocket(undefined);
    setJoined(false);
  });

  const joinOrCreate = (data: {
    name: string;
    action: string;
    roomCode?: string;
  }) => {
    socket?.send(JSON.stringify(data));
    setJoined(true);
  };

  const sendMessage = (message: string) => {
    const data = {
      action: "sendMessage",
      message,
    };

    socket?.send(JSON.stringify(data));
    setMessages([...messages, { message, mine: true }]);
  };
  return (
    <div className="App">
      {!socket ? (
        <div>
          <input
            onChange={(e) => setTypingUrl(e.target.value)}
            value={typingUrl}
          />
          <button onClick={() => websocketConnect()}>Connect</button>
        </div>
      ) : joined ? (
        <MessageUI messages={messages} sendMessage={sendMessage} />
      ) : (
        <JoinOrCreate onSubmit={(data: any) => joinOrCreate(data)} />
      )}
    </div>
  );
}

export default App;
