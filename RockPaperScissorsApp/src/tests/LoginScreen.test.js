import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import LoginScreen from "../pages/LoginScreen";
import { Route, BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";

describe("LoginScreen", () => {
  it("renders login form", () => {
    const { getByLabelText, getByRole } = render(
      <Router>
        <LoginScreen />
      </Router>
    );

    expect(getByLabelText(/Username:/i)).toBeInTheDocument();
    expect(getByLabelText(/Password:/i)).toBeInTheDocument();
    expect(getByRole("button", { name: /Login/i })).toBeInTheDocument();
    expect(getByRole("heading", { name: /Login/i })).toBeInTheDocument();
  });

  it("updates username and password fields on change", () => {
    const { getByLabelText } = render(
      <Router>
        <LoginScreen />
      </Router>
    );

    const usernameField = getByLabelText(/Username:/i);
    fireEvent.change(usernameField, { target: { value: "testuser" } });
    expect(usernameField.value).toBe("testuser");

    const passwordField = getByLabelText(/Password:/i);
    fireEvent.change(passwordField, { target: { value: "testpass" } });
    expect(passwordField.value).toBe("testpass");
  });

  it("displays an error message when form is submitted with empty fields", async () => {
    const { getByLabelText, getByRole, findByText } = render(
      <Router>
        <LoginScreen />
      </Router>
    );

    const loginButton = getByRole("button", { name: /Login/i });

    fireEvent.click(loginButton);

    const errorMessage1 = await findByText(/Password is required/i);
    const errorMessage2 = await findByText(/Username is required/i);
    expect(errorMessage1).toBeInTheDocument();
    expect(errorMessage2).toBeInTheDocument();
  });
});
