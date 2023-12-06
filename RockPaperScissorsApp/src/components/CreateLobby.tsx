// CreateLobby.tsx
import React, { useState } from "react";
import { useAtom } from "jotai";
import {
  lobbyNameAtom,
  waitingForSecondPlayerAtom,
  activeLobbiesAtom,
  activePlayerAtom,
} from "../components/states";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const CreateLobby: React.FC = () => {
  const [lobbyName, setLobbyName] = useAtom(lobbyNameAtom);
  const [waitingForSecondPlayer, setWaitingForSecondPlayer] = useAtom(
    waitingForSecondPlayerAtom
  );
  const [activeLobbies, setActiveLobbies] = useAtom(activeLobbiesAtom);
  const [activePlayer, setActivePlayer] = useAtom(activePlayerAtom);
  const [error, setError] = useState<string | null>(null);

  const handleCreateLobby = () => {
    const generatedLobbyName = lobbyName;

    // Überprüfe, ob eine Lobby mit dem gleichen Namen bereits existiert
    const lobbyExists = activeLobbies.some(
      (lobby) => lobby.name === generatedLobbyName
    );

    if (lobbyExists) {
      setError(
        "Lobby with the same name already exists. Please choose a different name."
      );
      return;
    }

    // Wenn keine Lobby mit dem gleichen Namen existiert, füge die neue Lobby hinzu
    const newLobby = {
      name: generatedLobbyName,
      player1: activePlayer,
      player2: "",
    };
    setActiveLobbies((prevLobbies) => [...prevLobbies, newLobby]);

    setLobbyName(generatedLobbyName);
    setWaitingForSecondPlayer(true);
    setError(null);

    // Emit a Socket.io event to inform the server about the new lobby
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
