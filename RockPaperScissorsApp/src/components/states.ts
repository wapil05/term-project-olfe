import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

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
