import React, { useEffect, useState } from "react";
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

  const WS_URL = process.env.REACT_APP_WS_URL;

  const websocketConnect = () => {
    if (!WS_URL && !typingUrl) return;

    if (WS_URL) {
      const ws = new WebSocket(WS_URL);
      setSocket(ws);
    } else {
      const ws = new WebSocket(typingUrl);
      setSocket(ws);
    }
  };

  useEffect(() => {
    websocketConnect();
  }, [WS_URL]);

  socket?.addEventListener("message", function (event) {
    try {
      const messageData = JSON.parse(event.data);

      if (messageData.type === "err") {
        setJoined(false);
        toast(messageData.message);
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
      <ToastContainer />
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
