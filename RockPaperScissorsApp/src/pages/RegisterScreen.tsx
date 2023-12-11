// RegisterScreen.tsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { useAtom } from "jotai";
import { userAtom } from "../components/states";
import { activePlayerAtom } from "../components/states";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("connected");
});

function RegisterScreen() {
  const [user, setUser] = useAtom(userAtom);
  const [, setActivePlayer] = useAtom(activePlayerAtom);
  const [registrationError, setRegistrationError] = useState<string | null>(
    null
  );
  const [registrationSuccess, setRegistrationSuccess] = useState<{
    userId: number;
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleRegisterError = (error: { message: string }) => {
      console.error("Registration Error:", error.message);
      setRegistrationError(error.message);
    };

    socket.on("registerError", handleRegisterError);

    return () => {
      socket.off("registerError", handleRegisterError);
    };
  }, []);

  useEffect(() => {
    const handleRegisterSuccess = (data: { userId: number }) => {
      setRegistrationSuccess(data);
    };

    socket.on("registerSuccess", handleRegisterSuccess);

    return () => {
      socket.off("registerSuccess", handleRegisterSuccess);
    };
  }, []);

  useEffect(() => {
    if (registrationSuccess) {
      console.log("Registration successful. Redirecting to /home");
      setActivePlayer(user.name);
      navigate("/home");
    }
  }, [registrationSuccess, navigate]);

  const handleSubmit = async () => {
    setActivePlayer(user.name);
    socket.emit("register", user);
    console.log("Registering user " + user.name);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="register-container p-8 border border-gray-300 rounded shadow-md text-center">
        <h2 className="text-2xl font-bold mb-6">Register</h2>
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
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer transition duration-300 hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Register
        </button>
        {registrationError && (
          <p className="text-red-500 mt-2">{registrationError}</p>
        )}
      </div>
      <Link to="/login" className="text-blue-500 mt-4">
        Login
      </Link>
    </div>
  );
}

export default RegisterScreen;
