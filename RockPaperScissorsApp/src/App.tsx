import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import RegisterScreen from "./pages/RegisterScreen";
import StartScreen from "./pages/StartScreen";
import LoginScreen from "./pages/LoginScreen";
import LobbyScreen from "./pages/LobbyScreen";
import GameScreen from "./pages/GameScreen";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterScreen />} />
        <Route path="/home" element={<StartScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route
          path="/lobby/:lobbyId/:player1/:player2"
          element={<LobbyScreen />}
        />
        <Route
          path="/game/:lobbyId/:player1/:player2/:rounds"
          element={<GameScreen />}
        />
      </Routes>
    </Router>
  );
}

export default App;
