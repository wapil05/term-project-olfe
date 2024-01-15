import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { useParams } from "react-router-dom";
import { activePlayerAtom, socketAtom } from "../components/states";

function GameScreen() {
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [opponentSymbol, setOpponentSymbol] = useState("");
  const [timer, setTimer] = useState(3);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const { player1, player2, lobbyName, selectedOption } = useParams();
  const [activePlayer] = useAtom(activePlayerAtom);
  const [socket] = useAtom(socketAtom);

  useEffect(() => {
    const countdown = setInterval(() => {
      if (timer > 0) {
        setTimer((prevTimer) => prevTimer - 1);
      } else {
        setIsTimerActive(false);
        clearInterval(countdown);
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer]);

  const symbols = ["Rock", "Paper", "Scissors"];

  const handleSymbolClick = (symbol: string) => {
    if (!isTimerActive) return;
    setSelectedSymbol(symbol);
  };

  const getRandomSymbol = () => {
    const randomIndex = Math.floor(Math.random() * symbols.length);
    return symbols[randomIndex];
  };

  useEffect(() => {
    if (timer === 0 && selectedSymbol === "") {
      const randomSymbol = getRandomSymbol();
      setSelectedSymbol(randomSymbol);
      setIsTimerActive(false);
    }
    console.log(selectedSymbol);

    socket.emit("selectedSymbolChanged", {
      lobbyName,
      player: activePlayer,
      selectedSymbol,
    });
  }, [timer, selectedSymbol]);

  useEffect(() => {
    socket.on("selectedSymbolChanged", (data) => {
      if (data.player !== activePlayer) {
        setOpponentSymbol(data.selectedSymbol);
      }
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen border border-black bg-gray-100 p-2">
      <div className="mb-2 bg-gray-300 rounded-md p-2">
        <h1 className="text-4xl font-bold mb-1">Rock Paper Scissors</h1>
      </div>
      <div className="flex justify-center mb-2">
        <div className="flex flex-col items-center mr-4">
          <div className="bg-gray-200 rounded-lg p-2 mb-1">{activePlayer}</div>
          <div className="bg-white rounded-lg p-4 text-2xl border border-gray-300">
            {selectedSymbol === "" ? "-" : selectedSymbol}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-gray-200 rounded-lg p-2 mb-1">
            {activePlayer === player2 ? player1 : player2}
          </div>
          <div className="bg-gray-200 rounded-lg p-4 text-2xl border border-gray-300">
            {timer === 0
              ? opponentSymbol === ""
                ? "-"
                : opponentSymbol
              : "Waiting..."}
          </div>
        </div>
      </div>
      <h3 className="text-3xl bg-gray-300 rounded-md p-1 mb-2">{timer}</h3>
      <h2 className="text-lg mb-2">
        Choose your symbol! {isTimerActive ? "⏳" : "⌛"}
      </h2>
      <div className="flex">
        {symbols.map((symbol) => (
          <button
            key={symbol}
            onClick={() => handleSymbolClick(symbol)}
            disabled={!isTimerActive}
            className={`bg-blue-500 text-white px-4 py-2 rounded cursor-pointer mr-2 ${
              !isTimerActive && "opacity-50 cursor-not-allowed"
            }`}
          >
            {symbol}
          </button>
        ))}
      </div>
    </div>
  );
}

export default GameScreen;
