import React, { useState } from "react";

type JoinOrCreateProps = {
  onSubmit: any;
};

const JoinOrCreate: React.FC<JoinOrCreateProps> = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const create = () => {
    if (!name) return;
    onSubmit({
      name,
      action: "createRoom",
    });
  };
  const join = () => {
    if (!name || !roomCode) return;

    onSubmit({
      name,
      action: "joinRoom",
      roomCode,
    });
  };

  return (
    <div className="joinOrCreateWrapper">
      <div className="createRoomWrapper">
        <h2>Create Room</h2>
        <div>
          <span>Your name</span>
          <input type="text" onChange={(e) => setName(e.target.value)} />
        </div>
        <button onClick={() => create()}>Create</button>
      </div>
      <div className="joinRoomWrapper">
        <h2>Join Room</h2>
        <div>
          <span>Room Code</span>
          <input type="text" onChange={(e) => setRoomCode(e.target.value)} />
        </div>
        <div>
          <span>Your name</span>
          <input type="text" onChange={(e) => setName(e.target.value)} />
        </div>
        <button onClick={() => join()}>Join</button>
      </div>
    </div>
  );
};

export default JoinOrCreate;
