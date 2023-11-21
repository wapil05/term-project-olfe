import React from "react";
import { useAtom } from "jotai";
import { lobbyNameAtom, waitingForSecondPlayerAtom, activeLobbiesAtom, activePlayerAtom } from "../components/states";

interface CreateLobbyProps {
  onCreateLobby?: () => void; // Mach die Prop optional
}

const CreateLobby: React.FC<CreateLobbyProps> = ({ onCreateLobby }) => {
  const [lobbyName, setLobbyName] = useAtom(lobbyNameAtom);
  const [waitingForSecondPlayer, setWaitingForSecondPlayer] = useAtom(waitingForSecondPlayerAtom);
  const [activeLobbies, setActiveLobbies] = useAtom(activeLobbiesAtom);
  const [activePlayer, setActivePlayer] = useAtom(activePlayerAtom);

  const handleCreateLobby = () => {
    const generatedLobbyName = lobbyName;

    const newLobby = { name: generatedLobbyName, player1: activePlayer, player2: "" };
    setActiveLobbies((prevLobbies) => [...prevLobbies, newLobby]);

    setLobbyName(generatedLobbyName);
    setWaitingForSecondPlayer(true);
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
    </div>
  );
};

export default CreateLobby;
