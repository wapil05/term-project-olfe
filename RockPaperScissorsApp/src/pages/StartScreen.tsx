// StartScreen.tsx
import React from "react";
import { useAtom } from "jotai";
import { activeLobbiesAtom, activePlayerAtom, lobbyAtom } from "../components/states";
import CreateLobby from "../components/CreateLobby";

function StartScreen() {
  const [activePlayer, setActivePlayer] = useAtom(activePlayerAtom);
  const activeLobbies = useAtom(activeLobbiesAtom)[0];
  const [lobby, setLobby] = useAtom(lobbyAtom);

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
              {lobby.name} - Player 1: {lobby.player1}, Player 2: {lobby.player2 || "Waiting..."}
              {lobby.player1 === activePlayer && (
                <button className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                onClick={handleLobbyClick}>
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
