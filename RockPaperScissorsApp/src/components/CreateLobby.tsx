// CreateLobby.tsx
import React, { useState } from "react";
import { useAtom } from "jotai";
import {
  lobbyNameAtom,
  waitingForSecondPlayerAtom,
  activeLobbiesAtom,
  activePlayerAtom,
  socketAtom,
} from "../components/states";

const CreateLobby: React.FC = () => {
  const [lobbyName, setLobbyName] = useAtom(lobbyNameAtom);
  const [, setWaitingForSecondPlayer] = useAtom(waitingForSecondPlayerAtom);
  const [activeLobbies, setActiveLobbies] = useAtom(activeLobbiesAtom);
  const [activePlayer] = useAtom(activePlayerAtom);
  const [error, setError] = useState<string | null>(null);
  const [socket] = useAtom(socketAtom);

  const handleCreateLobby = () => {
    const generatedLobbyName = lobbyName;

    if (!activePlayer) {
      setError("You need to login first.");
      return;
    }

    if (!generatedLobbyName) {
      setError("Lobby name cannot be empty.");
      return;
    }

    const lobbyExists = activeLobbies.some(
      (lobby) => lobby.name === generatedLobbyName
    );

    if (lobbyExists) {
      setError(
        "Lobby with the same name already exists. Please choose a different name."
      );
      return;
    }

    const newLobby = {
      name: generatedLobbyName,
      player1: activePlayer,
      player2: "",
    };
    setActiveLobbies((prevLobbies) => [...prevLobbies, newLobby]);

    setLobbyName(generatedLobbyName);
    setWaitingForSecondPlayer(true);
    setError(null);

    socket.emit("createLobby", newLobby);
  };

  return (
    <div className="mt-3">
      <button
        onClick={handleCreateLobby}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
      >
        Create Lobby
      </button>
      <input
        type="text"
        placeholder="Enter Lobby Name"
        value={lobbyName}
        onChange={(e) => setLobbyName(e.target.value)}
        className="border px-2 py-1 rounded-md"
      />
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default CreateLobby;
