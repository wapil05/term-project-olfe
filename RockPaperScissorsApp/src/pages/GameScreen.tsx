import React, { useState, useEffect } from "react";

function GameScreen() {
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [timer, setTimer] = useState(10);
  const [isTimerActive, setIsTimerActive] = useState(true);

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

  const symbols = ["Schere", "Stein", "Papier"];

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
  }, [timer, selectedSymbol]);

  return (
    <div className="flex flex-col items-center justify-center h-screen border border-black bg-gray-100 p-2">
      <div className="mb-2 bg-gray-300 rounded-md p-2">
        <h1 className="text-4xl font-bold mb-1">Schere Stein Papier Kampf</h1>
      </div>
      <div className="flex justify-center mb-2">
        <div className="flex flex-col items-center mr-4">
          <div className="bg-gray-200 rounded-lg p-2 mb-1">Spieler 1</div>
          <div className="bg-white rounded-lg p-4 text-2xl border border-gray-300">
            {selectedSymbol === "" ? "-" : selectedSymbol}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-gray-200 rounded-lg p-2 mb-1">Spieler 2</div>
          <div className="bg-gray-200 rounded-lg p-4 text-2xl border border-gray-300">
            -
          </div>
        </div>
      </div>
      <h3 className="text-3xl bg-gray-300 rounded-md p-1 mb-2">{timer}</h3>
      <h2 className="text-lg mb-2">
        Wähle ein Symbol innerhalb der angegebenen Zeit
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
