import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

type MessageUIProps = {
  messages: any[];
  sendMessage: (message: string) => void;
};

const MessageUI: React.FC<MessageUIProps> = ({ messages, sendMessage }) => {
  const [reply, setReply] = useState("");

  const submit = () => {
    sendMessage(reply);
    setReply("");
  };
  return (
    <div className="chat-interface">
      <div className="message-container">
        {messages.map((message: any, i: number) => {
          if (message.type === "info") {
            return (
              <div key={i} className="info">
                {message.message}
              </div>
            );
          }
          if (message.mine) {
            return (
              <div key={i} className={`message right`}>
                <p>{message.message}</p>
                <FaUserCircle />
              </div>
            );
          } else {
            return (
              <div key={i} className={`message left`}>
                <FaUserCircle />
                <p>{`${message.from} - ${message.message}`}</p>
              </div>
            );
          }
        })}
      </div>
      <div className="message-input">
        <input
          type="text"
          onChange={(e) => setReply(e.target.value)}
          value={reply}
        />
        <button onClick={() => submit()}>Send</button>
      </div>
    </div>
  );
};

export default MessageUI;
