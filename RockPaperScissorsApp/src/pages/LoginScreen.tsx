import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { activePlayerAtom, socketAtom } from "../components/states";
import { useForm } from "react-hook-form";

interface FormData {
  username: string;
  password: string;
}

function LoginScreen() {
  const [loginError, setLoginError] = useState<string | null>(null);
  const [, setActivePlayer] = useAtom(activePlayerAtom);
  const [socket] = useAtom(socketAtom);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { username: "", password: "" } });

  const navigate = useNavigate();

  const onSubmit = (data: FormData) => {
    //e.preventDefault();

    console.log("Login data:", data);
    socket.emit("login", data);

    setActivePlayer(data.username);
    console.log("Logging in user " + data.username);
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
      const customMessage = "E-Mail oder Passwort ist falsch!";
      setLoginError(customMessage);
    };

    socket.on("loginError", handleLoginError);

    return () => {
      socket.off("loginError", handleLoginError);
    };
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 bg-blue-500 text-white font-bold px-4 py-2 rounded cursor-pointer transition duration-300 hover:bg-blue-700"
      >
        Register
      </button>
      <div className="login-container p-8 border border-gray-300 rounded shadow-md text-center">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="username" className="block font-semibold">
              Username:
            </label>
            <input
              type="text"
              id="username"
              className="border border-gray-300 rounded px-3 py-2 w-80 placeholder-gray-500 text-xs"
              placeholder="Enter your username"
              {...register("username", {
                required: {
                  value: true,
                  message: "Username is required",
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
            Login
          </button>
        </form>
        {loginError && <p className="text-red-500 mt-2">{loginError}</p>}
      </div>
    </div>
  );
}

export default LoginScreen;
