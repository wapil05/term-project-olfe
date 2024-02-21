// CreateLobby.test.tsx
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import CreateLobby from "../components/CreateLobby";

// For all of these tests, you probably would want to use a custom render wrapper for
// the testing library render, as it would need a BrowerRouter around to 
// effectively use the useNavigate hook. 

describe("CreateLobby component", () => {
  it("should handle creating a lobby", () => {
    jest.mock("../components/states", () => ({
      useAtom: jest.fn(),
    }));

    const { getByText, getByPlaceholderText } = render(<CreateLobby />);

    jest.spyOn(window, "alert").mockImplementation(() => {});

    fireEvent.change(getByPlaceholderText("Enter Lobby Name"), {
      target: { value: "TestLobby" },
    });
    fireEvent.click(getByText("Create Lobby"));

    expect(window.alert).not.toHaveBeenCalled();

    jest.restoreAllMocks();
  });

  it("should handle missing login", () => {
    jest.mock("../components/states", () => ({
      useAtom: jest.fn(() => [null]),
    }));

    const { getByText } = render(<CreateLobby />);

    fireEvent.click(getByText("Create Lobby"));

    jest.restoreAllMocks();
  });

  it("should handle empty lobby name", () => {
    jest.mock("../components/states", () => ({
      useAtom: jest.fn(),
    }));

    const { getByText } = render(<CreateLobby />);

    fireEvent.click(getByText("Create Lobby"));

    jest.restoreAllMocks();
  });

  it("should handle existing lobby name", () => {
    jest.mock("../components/states", () => ({
      useAtom: jest.fn(() => ["TestPlayer", [], jest.fn()]),
    }));

    const { getByText, getByPlaceholderText } = render(<CreateLobby />);

    fireEvent.change(getByPlaceholderText("Enter Lobby Name"), {
      target: { value: "TestLobby" },
    });
    fireEvent.click(getByText("Create Lobby"));

    jest.restoreAllMocks();
  });
});
