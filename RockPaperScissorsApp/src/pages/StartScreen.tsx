// StartScreen.tsx
import React from "react";
import { useAtom } from "jotai";
import {
  activeLobbiesAtom,
  activePlayerAtom,
  lobbyAtom,
} from "../components/states";
import CreateLobby from "../components/CreateLobby";
import io from "socket.io-client";
import { useEffect } from "react";

const socket = io("http://localhost:3000");

function StartScreen() {
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

  function handleLobbyClick() {
    console.log("Lobby clicked");
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
                  className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                  onClick={handleLobbyClick}
                >
                  View Lobby
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
