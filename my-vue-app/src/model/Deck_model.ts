import type { Card, Colour } from "./Card_model";
import { announce, standardShuffler } from "../utils/random_utils";

export const colors: Colour[] = ["Red", "Blue", "Green", "Yellow"];
export type Deck = {
  /**
   * The deck of cards.
   */
  readonly preparedDeck: Card[];
  /**
   * Shuffle the deck.
   */
  shuffle: () => void;
  /**
   * Deal a number of cards from the deck.
   */
  deal: (numberOfCards: number) => Card[];
  /**
   * Get the number of cards in the deck.
   */
  size: () => number;
  /**
   * Discard the top card from the deck.
   */
  discardTopCard: () => Card;
  /**
   * Adds cards to the deck and shuffles it.
   */
  addCards: (newCards: Card[]) => void;
};

///helper functions
const addActionCards = (preparedDeck: Card[], colour: Colour) => {
  const actionCards: Card[] = [
    { type: "SKIP", colour },
    { type: "REVERSE", colour },
    { type: "DRAWTWO", colour },
  ];

  actionCards.forEach((card) => {
    preparedDeck.push(card, { ...card }); // Add two of each action card
  });
};

const addNumberedCards = (preparedDeck: Card[], colour: Colour) => {
  for (let i = 0; i <= 9; i++) {
    const newCard: Card = { type: "NUMBERED", colour, value: i };
    preparedDeck.push(newCard);
    if (i > 0) preparedDeck.push({ ...newCard }); // Add two of each number except 0
  }
};

const addWildCards = (preparedDeck: Card[]) => {
  for (let i = 0; i < 4; i++) {
    preparedDeck.push({ type: "WILD", colour: "Red" });
    preparedDeck.push({ type: "WILDDRAWFOUR", colour: "Red" });
  }
};

/**
 *   Create a new deck of UNO cards.
 */
export const createDeck = (): Deck => {
  let preparedDeck: Card[] = [];

  colors.forEach((colour) => {
    addNumberedCards(preparedDeck, colour);
    addActionCards(preparedDeck, colour);
  });

  addWildCards(preparedDeck);

  const shuffle = () => {
    console.log(announce("Shuffling the deck..."));
    standardShuffler(preparedDeck);
  };

  const discardTopCard = (): Card => preparedDeck.pop() as Card;

  const deal = (numberOfCards: number): Card[] => {
    const dealtCards: Card[] = [];
    for (let i = 0; i < numberOfCards; i++) {
      const card = preparedDeck.pop();
      if (card) dealtCards.push(card);
    }
    return dealtCards;
  };

  const size = () => preparedDeck.length;

  const addCards = (newCards: Card[]) => {
    preparedDeck.push(...newCards);
    shuffle();
  };

  console.log(size());

  return { shuffle, deal, preparedDeck, size, discardTopCard, addCards };
};
