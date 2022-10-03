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

  console.log({ log: "THE MESSAGES", messages });

  const websocketConnect = () => {
    console.log({ message: "CONNECT CLICKED" });

    if (!websocketUrl) return;

    const ws = new WebSocket(websocketUrl);
    console.log({ message: "THE WS", ws });
    setSocket(ws);
  };

  useEffect(() => {
    console.log("createing websocket Use Effect");
    websocketConnect();
  }, []);

  socket?.addEventListener("message", function (event) {
    console.log("message received", event.data);

    try {
      const messageData = JSON.parse(event.data);
      console.log("messageData", messageData);

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
    console.log("ws disconnected");
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
