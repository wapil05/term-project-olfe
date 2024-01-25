import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import {
  activePlayerAtom,
  socketAtom,
  selectedOptionsAtom,
  isReadyAtom,
} from "../components/states";

function LobbyScreen() {
  const navigate = useNavigate();
  const { lobbyName, player1, player2 } = useParams();

  const [activePlayer] = useAtom(activePlayerAtom);
  const [isCreator, setisCreator] = useState(false);
  const [socket] = useAtom(socketAtom);
  const [isReady, setIsReady] = useAtom(isReadyAtom);

  const [selectedOptions, setSelectedOptions] = useAtom(selectedOptionsAtom);

  const selectedOption = lobbyName
    ? selectedOptions[lobbyName as keyof typeof selectedOptions]
    : "";

  console.log("selectedOption:", selectedOption);

  const setSelectedOption = (newSelectedOption: string) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [String(lobbyName)]: newSelectedOption,
    }));
  };

  useEffect(() => {
    socket.on("startGame", (data) => {
      console.log("Game started");
      navigate(
        `/game/${data.lobbyName}/${data.player1}/${data.player2}/${data.selectedOption}`
      );
    });
    socket.on("selectedOptionChanged", (newSelectedOption) => {
      setSelectedOption(newSelectedOption);
    });
    socket.on("player2Ready", (isReady) => {
      setIsReady(isReady);
    });
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.off("startGame");
      socket.off("selectedOptionChanged");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  useEffect(() => {
    socket.emit("selectedOptionChanged", { lobbyName, selectedOption });
  }, [selectedOption]);

  useEffect(() => {
    if (player1 === activePlayer) {
      setisCreator(true);
    }
  }, [player1]);

  useEffect(() => {}, [isReady]);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const startGame = () => {
    const data = {
      lobbyName,
      player1,
      player2,
      selectedOption,
    };

    setIsReady(false);

    console.log("Starting game");
    socket.emit("startGameRequest", data);
    console.log("startGameRequest event emitted", data);
  };

  const handleReadyClick = () => {
    setIsReady(!isReady);
    socket.emit("player2Ready", { lobbyName, isReady: !isReady });
  };

  useEffect(() => {
    console.log("selectedOption:", selectedOption);
    console.log("isReady:", isReady);
  }, [selectedOption, isReady]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="border-4 border-gray-300 rounded-lg p-8 bg-gray-100 shadow-md">
        <h2 className="text-3xl font-bold mb-4">Lobby</h2>
        <h3 className="text-xl mb-6">Ready?</h3>
        <div className="flex justify-between mb-4">
          <h2 className="bg-blue-500 text-white px-4 py-2 rounded font-bold">
            {player1}
          </h2>
          <h2 className="bg-blue-500 text-white px-4 py-2 rounded font-bold">
            {player2}
          </h2>
        </div>
        <div className="mb-4">
          <h3 className="text-lg mb-2">
            <span className="font-bold">First to win: {selectedOption}</span>
          </h3>
          <label className="block mb-2">
            <input
              type="radio"
              value="2"
              checked={selectedOption === "2"}
              onChange={() => handleOptionSelect("2")}
              className="mr-2"
              disabled={!isCreator}
            />
            Best of 3
          </label>
          <label className="block mb-2">
            <input
              type="radio"
              value="3"
              checked={selectedOption === "3"}
              onChange={() => handleOptionSelect("3")}
              className="mr-2"
              disabled={!isCreator}
            />
            Best of 5
          </label>
          <label className="block">
            <input
              type="radio"
              value="4"
              checked={selectedOption === "4"}
              onChange={() => handleOptionSelect("4")}
              className="mr-2"
              disabled={!isCreator}
            />
            Best of 7
          </label>
        </div>
        <div className="bg-gray-200 rounded-lg p-4 mb-4">
          <h3 className="text-lg mb-2">!!!</h3>
          <p className="text-sm">
            Only the creator of the lobby can select the number of rounds and
            start the game.
          </p>
        </div>
        {player1 === activePlayer && (
          <button
            className={`text-white px-6 py-3 rounded cursor-pointer font-bold ${
              !selectedOption || !isReady ? "bg-red-500" : "bg-green-500"
            }`}
            onClick={startGame}
            disabled={!selectedOption || !isReady}
          >
            Start Game
          </button>
        )}
        {player2 === activePlayer && (
          <button
            className={` text-white px-6 py-3 rounded cursor-pointer font-bold ${
              !isReady ? "bg-red-500" : "bg-green-500"
            }`}
            onClick={handleReadyClick}
          >
            {!isReady ? "Not Ready" : "Ready"}
          </button>
        )}
      </div>
    </div>
  );
}

export default LobbyScreen;
