import React, { useState } from "react";
import { useParams } from "react-router-dom";

function LobbyScreen() {
  const { lobbyId, player1, player2 } = useParams();

  const [selectedOption, setSelectedOption] = useState("");
  const [isCreator] = useState(false);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const startGame = () => {
    console.log(`Spiel starten mit Option: ${selectedOption}`);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="border-4 border-gray-300 rounded-lg p-8 bg-gray-100 shadow-md">
        <h2 className="text-3xl font-bold mb-4">Willkommen in der Lobby</h2>
        <h3 className="text-xl mb-6">Bist du bereit zum Spielen?</h3>
        <div className="flex justify-between mb-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
            {player1}
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
            {player2}
          </button>
        </div>
        <div className="mb-4">
          <h3 className="text-lg mb-2">
            <span className="font-bold">{selectedOption}</span>
          </h3>
          <label className="block mb-2">
            <input
              type="radio"
              value="Best of 3"
              checked={selectedOption === "Best of 3"}
              onChange={() => handleOptionSelect("Best of 3")}
              className="mr-2"
            />
            Best of 3
          </label>
          <label className="block mb-2">
            <input
              type="radio"
              value="Best of 4"
              checked={selectedOption === "Best of 4"}
              onChange={() => handleOptionSelect("Best of 4")}
              className="mr-2"
            />
            Best of 4
          </label>
          <label className="block">
            <input
              type="radio"
              value="Best of 5"
              checked={selectedOption === "Best of 5"}
              onChange={() => handleOptionSelect("Best of 5")}
              className="mr-2"
            />
            Best of 5
          </label>
        </div>
        <div className="bg-gray-200 rounded-lg p-4 mb-4">
          <h3 className="text-lg mb-2">Achtung:</h3>
          <p className="text-sm">
            Nur der Spieler, der die Lobby erstellt hat, kann das Spiel starten
            und die Anzahl der Siege wählen.
          </p>
        </div>
        <button
          className="bg-green-500 text-white px-6 py-3 rounded cursor-pointer"
          onClick={startGame}
          disabled={!selectedOption || !isCreator}
        >
          Spiel starten
        </button>
      </div>
    </div>
  );
}

export default LobbyScreen;
