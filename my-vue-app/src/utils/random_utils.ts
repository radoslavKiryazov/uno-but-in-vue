import type { Card } from "../model/Card_model";
// A function that returns a (possibly) random number from 0 to bound - 1
export type Randomizer = (bound: number) => number;

// Uniformly selected pseudo-random number
export const standardRandomizer: Randomizer = (n) =>
  Math.floor(Math.random() * n);

// A function that shuffles the given array
export type Shuffler<T> = (cards: T[]) => void;

// Perfect shuffle using the Fisher-Yates method
export function standardShuffler<T>(cards: T[]) {
  for (let i = 0; i < cards.length - 1; i++) {
    const j = Math.floor(Math.random() * (cards.length - i) + i);
    const temp = cards[j];
    cards[j] = cards[i];
    cards[i] = temp;
  }
}
const cyan = "\x1b[36m";
const reset = "\x1b[0m";

export const announce = (message: string): string => {
  return `${cyan}${message}${reset}`;
};
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const canPlayCard = (
  card: Card,
  topCardFromDiscardPile: Card | undefined
): boolean => {
  if (!topCardFromDiscardPile) {
    return true;
  }
  return (
    // match by color
    card.colour === topCardFromDiscardPile.colour ||
    // match by number
    (card.type === "NUMBERED" &&
      topCardFromDiscardPile.type === "NUMBERED" &&
      card.value === topCardFromDiscardPile.value) ||
    // match by action/symbol
    (["REVERSE", "SKIP", "DRAWTWO"].includes(card.type) &&
      card.type === topCardFromDiscardPile.type) ||
    // wild and wild draw four can be played anytime
    card.type === "WILD" ||
    card.type === "WILDDRAWFOUR"
  );
};
