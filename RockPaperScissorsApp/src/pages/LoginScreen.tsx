import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { userAtom, activePlayerAtom, socketAtom } from "../components/states";

function LoginScreen() {
  const [loginData, setLoginData] = useState({
    name: "",
    password: "",
  });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [user, setUser] = useAtom(userAtom);
  const [, setActivePlayer] = useAtom(activePlayerAtom);
  const [socket] = useAtom(socketAtom);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    socket.emit("login", loginData);

    setActivePlayer(user.name);
    console.log("Logging in user " + user.name);
  };

  useEffect(() => {
    const handleLoginSuccess = () => {
      console.log("Login successful. Redirecting to /home");

      navigate("/home");
    };

    socket.on("loginSuccess", handleLoginSuccess);

    return () => {
      socket.off("loginSuccess", handleLoginSuccess);
    };
  }, [navigate]);

  useEffect(() => {
    const handleLoginError = (error: { message: string }) => {
      console.error("Login Error:", error.message);
      setLoginError(error.message);
    };

    socket.on("loginError", handleLoginError);

    return () => {
      socket.off("loginError", handleLoginError);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="login-container p-8 border border-gray-300 rounded shadow-md text-center">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="usernameOrEmail" className="block font-semibold">
              Username:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={loginData.name}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full placeholder-gray-500 text-xs"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block font-semibold">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full placeholder-gray-500 text-xs"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer transition duration-300 hover:bg-blue-700"
          >
            Login
          </button>
        </form>
        {loginError && <p className="text-red-500 mt-2">{loginError}</p>}
      </div>
    </div>
  );
}

export default LoginScreen;
