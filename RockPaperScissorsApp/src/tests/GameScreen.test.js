import React from "react";
import { render, act } from "@testing-library/react";
import GameScreen from "../pages/GameScreen";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";

jest.useFakeTimers();

describe("GameScreen", () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it("renders correct options", () => {
    const { getByText } = render(
      <Router>
        <GameScreen />
      </Router>
    );

    expect(getByText("Rock")).toBeInTheDocument();
    expect(getByText("Paper")).toBeInTheDocument();
    expect(getByText("Scissors")).toBeInTheDocument();
  });

  it("initially sets score to 0", () => {
    const { getByText } = render(
      <Router>
        <GameScreen />
      </Router>
    );

    expect(getByText(/0/)).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    const { getByText } = render(
      <Router>
        <GameScreen />
      </Router>
    );

    expect(getByText("5")).toBeInTheDocument();
  });

  it("counts down timer to 4 after 1 second", () => {
    const { getByText } = render(
      <Router>
        <GameScreen />
      </Router>
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(getByText("4")).toBeInTheDocument();
  });

  it("counts down timer to 3 after 2 seconds", () => {
    const { getByText } = render(
      <Router>
        <GameScreen />
      </Router>
    );

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(getByText("3")).toBeInTheDocument();
  });

  it("counts down timer to 0 after 5 seconds", () => {
    const { getByText } = render(
      <Router>
        <GameScreen />
      </Router>
    );

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(getByText("0")).toBeInTheDocument();
  });
});
