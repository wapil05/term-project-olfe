import { atom } from "jotai";

export const lobbyNameAtom = atom<string>("");

export const waitingForSecondPlayerAtom = atom<boolean>(false);

export const activeLobbiesAtom = atom<
  { name: string; player1: string; player2: string }[]
>([]);

export const activePlayerAtom = atom<string>("");

export const lobbyAtom = atom<{
  name: string;
  player1: string;
  player2: string;
} | null>(null);

export const userAtom = atom({
  name: "",
  email: "",
  password: "",
});
