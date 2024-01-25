import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import io from "socket.io-client";
import { Socket } from "socket.io-client";

interface User {
  id: number;
  name: string;
  wins: number;
  losses: number;
  roundsWon: number;
  roundsLost: number;
  flawlessVictories: number;
}

export const socketAtom = atom<Socket>(io("http://localhost:3000"));

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

export const selectedOptionsAtom = atom<{ [key: string]: string }>({});

export const isReadyAtom = atom<boolean>(false);

export const usersAtom = atom<User[]>([]);
