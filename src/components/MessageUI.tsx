import React, { useState } from "react";

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
    <div className="messageInterface">
      <div>
        {messages.map((message: any, i: number) => {
          if (message.type === "info") {
            return <div key={i}>{message.message}</div>;
          }
          if (message.mine) {
            return (
              <div key={i} className={`message right`}>
                {message.message}
              </div>
            );
          } else {
            return (
              <div
                key={i}
                className={`message left`}
              >{`${message.from} - ${message.message}`}</div>
            );
          }
        })}
      </div>
      <div className="messageInput">
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
