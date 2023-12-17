import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import io from "socket.io-client";
import { Socket } from "socket.io-client";

export const socketAtom = atom<Socket>(io("http://localhost:3000"));

// socketAtom.onMount = (setSocket) => {
//   const socket = io("http://localhost:3000");
//   setSocket(socket);
//   return () => {
//     socket.disconnect();
//   };
// };

export const lobbyNameAtom = atom<string>("");

export const waitingForSecondPlayerAtom = atom<boolean>(false);

export const activeLobbiesAtom = atom<
  { name: string; player1: string; player2: string }[]
>([]);

export const activePlayerAtom = atomWithStorage<string>("activePlayer", "");

export const lobbyAtom = atom<{
  name: string;
  player1: string;
  player2: string;
} | null>(null);

export const userAtom = atomWithStorage("user", {
  name: "",
  email: "",
  password: "",
});
