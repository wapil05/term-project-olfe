import React from 'react';

function LoginScreen() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="login-container p-8 border border-gray-300 rounded shadow-md text-center">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <form className="login-form">
          <div className="mb-4">
            <label htmlFor="usernameOrEmail" className="block font-semibold">
              Username or Email:
            </label>
            <input
              type="text"
              id="usernameOrEmail"
              name="usernameOrEmail"
              className="border border-gray-300 rounded px-3 py-2 w-full placeholder-gray-500 text-xs" // Anpassung der Textgröße
              placeholder="Enter your username or email" // Placeholder text
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
              className="border border-gray-300 rounded px-3 py-2 w-full placeholder-gray-500 text-xs" // Anpassung der Textgröße
              placeholder="Enter your password" // Placeholder text
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
      </div>
    </div>
  );
}

export default LoginScreen;






