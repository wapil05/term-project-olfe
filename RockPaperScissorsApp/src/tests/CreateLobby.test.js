// CreateLobby.test.tsx
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import CreateLobby from "../components/CreateLobby";


describe("CreateLobby component", () => {

  it("should handle creating a lobby", () => {
    // Mock the necessary atoms and socketAtom
    jest.mock("../components/states", () => ({
      useAtom: jest.fn(),
    }));

    const { getByText, getByPlaceholderText } = render(<CreateLobby />);

    // Mocking required functions and values for the component
    jest.spyOn(window, "alert").mockImplementation(() => {});

    // Mock any other dependencies that are not easily testable

    // Interact with the UI elements
    fireEvent.change(getByPlaceholderText("Enter Lobby Name"), {
      target: { value: "TestLobby" },
    });
    fireEvent.click(getByText("Create Lobby"));

    // Add assertions to check if the component behaves as expected
    // (e.g., check if the appropriate error message is displayed)
    expect(window.alert).not.toHaveBeenCalled(); // Hier wird erwartet, dass window.alert nicht aufgerufen wurde

    // Cleanup any mocks
    jest.restoreAllMocks();
  });


  it("should handle missing login", () => {
    // Mock the necessary atoms and socketAtom
    jest.mock("../components/states", () => ({
      useAtom: jest.fn(() => [null]),
    }));
  
    const { getByText } = render(<CreateLobby />);
  
    fireEvent.click(getByText("Create Lobby"));
  
    // Log the rendered HTML to the console for debugging
    console.log(document.body.innerHTML);
  
    // Add assertions to check if the component behaves as expected
  
    // Cleanup any mocks
    jest.restoreAllMocks();
  });
  
  

  it("should handle empty lobby name", () => {
    // Mock the necessary atoms and socketAtom
    jest.mock("../components/states", () => ({
      useAtom: jest.fn(),
    }));
  
    const { getByText } = render(<CreateLobby />);
  
    fireEvent.click(getByText("Create Lobby"));
  
    // Add assertions to check if the component behaves as expected
    // (e.g., check if the appropriate error message is displayed)
  
    // Cleanup any mocks
    jest.restoreAllMocks();
  });
  
  it("should handle existing lobby name", () => {
    // Mock the necessary atoms and socketAtom
    jest.mock("../components/states", () => ({
      useAtom: jest.fn(() => [
        "TestPlayer",  // Mocking activePlayer
        [],            // Mocking activeLobbies
        jest.fn(),     // Mocking setActiveLobbies
      ]),
    }));
  
    const { getByText, getByPlaceholderText } = render(<CreateLobby />);
  
    // Interact with the UI elements
    fireEvent.change(getByPlaceholderText("Enter Lobby Name"), {
      target: { value: "TestLobby" },
    });
    fireEvent.click(getByText("Create Lobby"));
  
    // Add assertions to check if the component behaves as expected
    // (e.g., check if the appropriate error message is displayed)
   
  
    // Cleanup any mocks
    jest.restoreAllMocks();
  });
  

});
