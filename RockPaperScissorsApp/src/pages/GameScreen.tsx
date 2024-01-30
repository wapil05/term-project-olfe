import React from "react";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { useParams } from "react-router-dom";
import {
  activePlayerAtom,
  socketAtom,
  activeLobbiesAtom,
} from "../components/states";
import { useNavigate } from "react-router-dom";

function GameScreen() {
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [opponentSymbol, setOpponentSymbol] = useState("");
  const [timer, setTimer] = useState(5);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [score, setScore] = useState([0, 0]);
  const [isReady, setIsReady] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const { player1, player2, lobbyName, selectedOption } = useParams();
  const [activePlayer] = useAtom(activePlayerAtom);
  const [socket] = useAtom(socketAtom);
  const [activeLobbies] = useAtom(activeLobbiesAtom);

  const navigate = useNavigate();

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

    if (timer === 0 && selectedSymbol) {
      socket.emit("selectedSymbolChanged", {
        lobbyName,
        player: activePlayer,
        selectedSymbol,
      });
    }
  }, [timer, selectedSymbol]);

  useEffect(() => {
    socket.on("selectedSymbolChanged", (data) => {
      if (data.player !== activePlayer) {
        setOpponentSymbol(data.selectedSymbol);
      }
    });
    socket.on("startRound", () => {
      setSelectedSymbol("");
      setOpponentSymbol("");
      setTimer(5);
      setIsTimerActive(true);
      setIsReady(false);
    });
    socket.on("gameOver", (data) => {
      console.log("Game over");
      console.log(data);
      setIsGameOver(true);
    });
  }, []);

  useEffect(() => {
    const winner = getWinner(selectedSymbol, opponentSymbol);

    if (winner === player1) {
      setScore((prevScore) => [prevScore[0] + 1, prevScore[1]]);
    } else if (winner === player2) {
      setScore((prevScore) => [prevScore[0], prevScore[1] + 1]);
    }
  }, [opponentSymbol]);

  useEffect(() => {
    if (activePlayer === player1) {
      socket.emit("roundDone", {
        lobbyName,
        player1: activePlayer,
        player2: player2,
        score,
        selectedOption,
      });
    }
  }, [score]);

  const getWinner = (player1Symbol: string, player2Symbol: string) => {
    if (player1Symbol === player2Symbol) {
      return "Draw";
    } else if (
      (player1Symbol === "Rock" && player2Symbol === "Scissors") ||
      (player1Symbol === "Paper" && player2Symbol === "Rock") ||
      (player1Symbol === "Scissors" && player2Symbol === "Paper")
    ) {
      return player1;
    } else {
      return player2;
    }
  };

  const handleReadyClick = () => {
    setIsReady(true);
    socket.emit("playerReady", { lobbyName, player: activePlayer });
  };

  const handleHomeClick = () => {
    navigate("/home");

    socket.emit("closeLobby", { lobbyName });

    for (let i = 0; i < activeLobbies.length; i++) {
      if (activeLobbies[i].name === lobbyName) {
        activeLobbies.splice(i, 1);
      }
    }
  };

  const handleLeaderboardClick = () => {
    navigate("/leaderboard");

    socket.emit("closeLobby", { lobbyName });

    for (let i = 0; i < activeLobbies.length; i++) {
      if (activeLobbies[i].name === lobbyName) {
        activeLobbies.splice(i, 1);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen border border-black bg-gray-100 p-2">
      <h1 className={`text-4xl font-bold mb-4 ${!isGameOver && "hidden"}`}>
        Game Over
      </h1>
      <div className="mb-2 bg-gray-300 rounded-md p-2">
        <h1 className="text-4xl font-bold mb-1">
          {score[0]} : {score[1]}
        </h1>
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
      <h3
        className={`text-3xl bg-gray-300 rounded-md p-1 mb-2 ${
          isGameOver && "hidden"
        }`}
      >
        {timer}
      </h3>
      <h2 className={`text-lg mb-2 ${isGameOver && "hidden"}`}>
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
            } ${isGameOver && "hidden"}`}
          >
            {symbol}
          </button>
        ))}
      </div>
      <button
        onClick={handleReadyClick}
        className={`px-4 py-2 rounded cursor-pointer mt-8 ${
          isReady ? "bg-green-500" : "bg-red-500"
        } text-white ${isTimerActive && "opacity-50 cursor-not-allowed"} ${
          isGameOver && "hidden"
        }`}
        disabled={isTimerActive}
      >
        {isReady ? "Ready" : "Ready?"}
      </button>

      <div className={`${!isGameOver && "hidden"} flex flex-col`}>
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded cursor-pointer mt-4`}
          onClick={handleLeaderboardClick}
        >
          Show Leaderboard!
        </button>
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded cursor-pointer mt-4`}
          onClick={handleHomeClick}
        >
          Home
        </button>
      </div>
    </div>
  );
}

export default GameScreen;
