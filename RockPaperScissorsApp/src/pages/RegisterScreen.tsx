// RegisterScreen.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { useAtom } from "jotai";
import { activePlayerAtom } from "../components/states";
import { useForm } from "react-hook-form";

const socket = io("http://localhost:3000");

interface FormData {
  username: string;
  password: string;
}

function RegisterScreen() {
  const [, setActivePlayer] = useAtom(activePlayerAtom);
  const [registrationError, setRegistrationError] = useState<string | null>(
    null
  );
  const [registrationSuccess, setRegistrationSuccess] = useState<{
    userId: number;
  } | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { username: "", email: "", password: "" } });

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
      navigate("/home");
    }
  }, [registrationSuccess, navigate]);

  const onSubmit = (data: FormData) => {
    console.log("Register data:", data);
    setActivePlayer(data.username);
    socket.emit("register", data);
    console.log("Registering user " + data.username);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={() => navigate("/login")}
        className="absolute top-4 left-4 bg-blue-500 font-bold text-white px-4 py-2 rounded cursor-pointer transition duration-300 hover:bg-blue-700"
      >
        Login
      </button>

      <div className="register-container p-8 border border-gray-300 rounded shadow-md text-center">
        <h2 className="text-2xl font-bold mb-6">Register</h2>
        <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="name" className="block font-semibold">
              Name:
            </label>
            <input
              type="text"
              id="name"
              className="border border-gray-300 rounded px-3 py-2 w-80 placeholder-gray-500 text-xs"
              placeholder="Enter your name"
              {...register("username", {
                required: {
                  value: true,
                  message: "Name is required",
                },
              })}
            />
            <p
              className="text-red-500 text-xs mt-1"
              style={{
                maxWidth: "300px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {errors.username?.message}
            </p>
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block font-semibold">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="border border-gray-300 rounded px-3 py-2 w-80 placeholder-gray-500 text-xs"
              placeholder="Enter your email"
              {...register("email", {
                required: {
                  value: true,
                  message: "Email is required",
                },
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message:
                    "Please enter a valid email address (e.g., example@example.com)",
                },
              })}
            />
            <p
              className="text-red-500 text-xs mt-1"
              style={{
                maxWidth: "300px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {errors.email?.message}
            </p>
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block font-semibold">
              Password:
            </label>
            <input
              type="password"
              id="password"
              className="border border-gray-300 rounded px-3 py-2 w-80 placeholder-gray-500 text-xs"
              placeholder="Enter your password"
              {...register("password", {
                required: {
                  value: true,
                  message: "Password is required",
                },
                minLength: {
                  value: 8,
                  message: "Password must have at least 8 characters",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                  message:
                    "Password must contain at least one uppercase letter, one lowercase letter, and one number",
                },
              })}
            />
            <p
              className="text-red-500 text-xs mt-1"
              style={{
                maxWidth: "300px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {errors.password?.message}
            </p>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer transition duration-300 hover:bg-blue-700"
          >
            Register
          </button>
        </form>
        {registrationError && (
          <p className="text-red-500 mt-2">{registrationError}</p>
        )}
      </div>
    </div>
  );
}

export default RegisterScreen;
