import type { Card } from "./Card_model";

export interface Player {
  readonly name: string;
  hand: Card[];
  score: number;
  isBot?: boolean;
  calledUNO?: boolean;
  unoCalledOut?: boolean;
}

export const createPlayer = (
  name: string,
  hand: Card[],
  isBot = false,
  calledUNO = false,
  unoCalledOut = false
) => {
  return { name, hand, score: 0, isBot, calledUNO, unoCalledOut };
};
