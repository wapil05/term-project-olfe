import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import RegisterScreen from "./pages/RegisterScreen";
import StartScreen from "./pages/StartScreen";
import LoginScreen from "./pages/LoginScreen";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterScreen />} />
        <Route path="/home" element={<StartScreen />} />
        <Route path="/login" element={<LoginScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
