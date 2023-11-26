// RegisterScreen.tsx
import React from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import { useAtom } from "jotai";
import { userAtom } from "../components/states";
import { useEffect } from "react";

import { activePlayerAtom } from "../components/states";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("connected");
});

function RegisterScreen() {
  const [user, setUser] = useAtom(userAtom);
  const [activePlayer, setActivePlayer] = useAtom(activePlayerAtom);

  const handleSubmit = () => {
    setActivePlayer(socket.id);
    socket.emit("register", user);
    console.log("Registered user " + socket.id);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="register-container p-8 border border-gray-300 rounded shadow-md text-center">
        <h2 className="text-2xl font-bold mb-6">Register</h2>
        <form className="register-form">
          <div className="mb-4">
            <label htmlFor="name" className="block font-semibold">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full placeholder-gray-500 text-xs"
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block font-semibold">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full placeholder-gray-500 text-xs"
              placeholder="Enter your email"
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
              value={user.password}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full placeholder-gray-500 text-xs"
              placeholder="Enter your password"
              required
            />
          </div>
          <Link to="/home">
            <button
              type="button" // Ändere dies zu "submit", wenn du es mit einem Formular umgeben möchtest
              className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer transition duration-300 hover:bg-blue-700"
              onClick={handleSubmit}
            >
              Register
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default RegisterScreen;
