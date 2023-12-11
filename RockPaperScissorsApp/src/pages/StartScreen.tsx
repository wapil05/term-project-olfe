import React from "react";
import { useAtom } from "jotai";
import { activeLobbiesAtom, activePlayerAtom } from "../components/states";
import CreateLobby from "../components/CreateLobby";
import io from "socket.io-client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:3000");

function StartScreen() {
  const navigate = useNavigate();
  const [activePlayer] = useAtom(activePlayerAtom);
  const [activeLobbies, setActiveLobbies] = useAtom(activeLobbiesAtom);

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
      <h1 className="text-3xl font-bold underline">Rock Paper Scissors</h1>
      <h2>By Oliver Wolfmayr and Felix Wacha</h2>
      <div className="mt-5">
        <h3>Active Lobbies:</h3>
        <ul>
          {activeLobbies.map((lobby) => (
            <li key={lobby.name}>
              {lobby.name} - Player 1: {lobby.player1}, Player 2:{" "}
              {lobby.player2 || "Waiting..."}
              {lobby.player1 === activePlayer && (
                <button
                  className={`bg-green-500 text-white px-4 py-2 rounded-md mr-2 ${
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
                  className={`bg-green-500 text-white px-4 py-2 rounded-md mr-2`}
                  onClick={() =>
                    handleLobbyClick(lobby.name, lobby.player1, lobby.player2)
                  }
                >
                  View Lobby
                </button>
              )}
              {lobby.player1 !== activePlayer && !lobby.player2 && (
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
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
