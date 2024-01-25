import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import RegisterScreen from "./pages/RegisterScreen";
import StartScreen from "./pages/StartScreen";
import LoginScreen from "./pages/LoginScreen";
import LobbyScreen from "./pages/LobbyScreen";
import GameScreen from "./pages/GameScreen";
import LeaderBoardScreen from "./pages/LeaderboardScreen";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterScreen />} />
        <Route path="/home" element={<StartScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route
          path="/lobby/:lobbyName/:player1/:player2"
          element={<LobbyScreen />}
        />
        <Route
          path="/game/:lobbyName/:player1/:player2/:selectedOption"
          element={<GameScreen />}
        />
        <Route path="/leaderBoard" element={<LeaderBoardScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
