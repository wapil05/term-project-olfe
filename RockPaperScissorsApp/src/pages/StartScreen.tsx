import { useAtom } from "jotai";
import {
  activeLobbiesAtom,
  activePlayerAtom,
  socketAtom,
} from "../components/states";
import CreateLobby from "../components/CreateLobby";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function StartScreen() {
  const navigate = useNavigate();
  // You could use useAtomValue if you only want to get the value 
  // from the atom. This way you would not need the array destruct.
  const [activePlayer] = useAtom(activePlayerAtom);
  const [activeLobbies, setActiveLobbies] = useAtom(activeLobbiesAtom);
  const [socket] = useAtom(socketAtom);

  useEffect(() => {
    socket.on("activeLobbies", (lobbies) => {
      setActiveLobbies(lobbies);
    });

    return () => {
      socket.off("activeLobbies");
    };
  }, [setActiveLobbies]);

  function handleLobbyClick(
    lobbyName: string,
    player1: string,
    player2: string
  ) {
    console.log("Lobby clicked " + lobbyName + " " + player1 + " " + player2);
    navigate(`/lobby/${lobbyName}/${player1}/${player2}`);
  }

  function handleJoinLobbyClick(lobbyName: string) {
    socket.emit("joinLobby", lobbyName, activePlayer);
  }

  return (
    <div className="text-center mt-10">
      <button
        className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          navigate("/leaderboard");
        }}
      >
        Leaderboard
      </button>
      <h1 className="text-3xl font-bold underline">Rock Paper Scissors</h1>
      <h2>By Oliver Wolfmayr and Felix Wacha</h2>
      <div className="mt-5">
        <h3>Active Lobbies:</h3>
        <ul>
          {activeLobbies.map((lobby) => (
            <li key={lobby.name} className="mb-4">
              {lobby.name} - Player 1: {lobby.player1}, Player 2:{" "}
              {lobby.player2 || "Waiting..."}
              {lobby.player1 === activePlayer && (
                <button
                  className={`bg-green-500 text-white px-4 py-2 rounded-md mr-2 font-bold ml-4 ${
                    !lobby.player2 && "hidden"
                  }`}
                  onClick={() =>
                    handleLobbyClick(lobby.name, lobby.player1, lobby.player2)
                  }
                  disabled={!lobby.player2}
                >
                  View Lobby
                </button>
              )}
              {lobby.player2 === activePlayer && (
                <button
                  className={`bg-green-500 text-white px-4 py-2 rounded-md mr-2 font-bold ml-4`}
                  onClick={() =>
                    handleLobbyClick(lobby.name, lobby.player1, lobby.player2)
                  }
                >
                  View Lobby
                </button>
              )}
              {lobby.player1 !== activePlayer && !lobby.player2 && (
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 font-bold ml-4"
                  onClick={() => handleJoinLobbyClick(lobby.name)}
                >
                  Join Lobby
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      <CreateLobby />
    </div>
  );
}

export default StartScreen;
