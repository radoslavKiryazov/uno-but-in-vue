import { cardPrinter } from "./Card_model";
import type { Card, Colour } from "./Card_model";

import { createDeck } from "./Deck_model";
import type { Deck } from "./Deck_model";
import type { Player } from "./Player_model";

export interface Hand {
  /** The discard pile of played cards */
  discardPile: Card[];

  /** Index of the current player's turn */
  readonly currentTurnIndex: number;

  /** Allows the current player to play a card by its index */
  playCard: (selectedCardIndex: number) => void;

  /** Allows a player to draw a specified number of cards */
  drawCards: (player: Player, numberOfCards: number) => void;

  /** Checks if a player has called "UNO" */
  checkForUNO: (player: Player) => void;

  /** Moves the turn to the next player */
  nextTurn: () => void;

  /** Ends the current hand*/
  endHand: () => void;

  /** Determines if the hand is over*/
  isHandOver: () => boolean;

  /** The deck of cards */
  deck: Deck;
}
/**
 * Creates and initializes a new hand with the given players.
 */
export const createHand = (players: Player[]): Hand => {
  const deck = createDeck();
  deck.shuffle();

  let discardPile: Card[] = [{ type: "NUMBERED", colour: "Blue", value: 1 }];
  let currentTopCard: Card;

  // do {
  //   currentTopCard = deck.deal(1)[0];
  //   discardPile.push(currentTopCard);
  // } while (currentTopCard.type !== "NUMBERED");

  console.log("Dealing 7 cards to each player...\n");
  players.forEach((player) => {
    player.hand = [
      { type: "NUMBERED", colour: "Blue", value: 1 },
      { type: "NUMBERED", colour: "Blue", value: 2 },
    ];
  });

  let currentTurnIndex: number = 0;

  const playCard = (selectedCardIndex: number) => {
    const player = players[currentTurnIndex]; // get the current player
    const { hand } = player;
    let selectedCard = hand[selectedCardIndex - 1]; // -1 because the index is 1 based

    if (canPlayCard(selectedCard)) {
      player.hand =
        hand.findIndex((c) => c === selectedCard) !== -1
          ? hand.filter((c) => c !== selectedCard)
          : hand;

      switch (selectedCard.type) {
        case "NUMBERED": {
          console.log("Card that was played:", cardPrinter(selectedCard));
          currentTurnIndex = (currentTurnIndex + 1) % players.length;
          break;
        }
        case "SKIP": {
          console.log(`${player.name} played a Skip!`);
          currentTurnIndex = (currentTurnIndex + 2) % players.length;
        }
        case "REVERSE": {
          players.reverse();
          console.log("Order of play has been reversed!");
          currentTurnIndex = (currentTurnIndex + 1) % players.length;
          break;
        }
        case "DRAWTWO": {
          console.log(`${player.name} played a Draw Two!`);

          const nextPlayer = players[(currentTurnIndex + 1) % players.length];
          currentTurnIndex = (currentTurnIndex + 2) % players.length;

          console.log(`${nextPlayer.name} must draw two cards!`);
          drawCards(nextPlayer, 2);
          console.log(`
            ${nextPlayer.name} has drawn two cards and their turn is skipped!
          `);
          break;
        }
        case "WILD": {
          const newColour: Colour = "Blue";
          console.log(`You selected ${newColour}!`);

          selectedCard = { ...selectedCard, colour: newColour };
          currentTurnIndex = (currentTurnIndex + 1) % players.length;
          break;
        }
        case "WILDDRAWFOUR": {
          const newColour: Colour = "Blue";
          console.log(`You selected ${newColour}!`);

          const nextPlayer = players[(currentTurnIndex + 1) % players.length];
          console.log(`${nextPlayer.name} must draw four cards!`);
          drawCards(nextPlayer, 4);

          console.log(`${nextPlayer.name}'s turn is skipped!`);
          selectedCard = { ...selectedCard, colour: newColour };
          currentTurnIndex = (currentTurnIndex + 2) % players.length;
          break;
        }
      }
      discardPile.push(selectedCard);

      checkForUNO(player);

      if (isHandOver()) {
        endHand();
        return;
      }
      console.clear();
      nextTurn();
    } else {
      console.log("Invalid card. Try again.");
      selectCardToPlay(currentTurnIndex);
    }
  };
  const selectCardToPlay = (playerIndex: number) => {
    const player = players[playerIndex];
    const { hand } = player;

    console.log(`\n${player.name}, it's your turn!`);

    printPlayersHand(hand);

    const isThereAPlayableCard = hand.some((card) => canPlayCard(card));
    if (!isThereAPlayableCard) {
      forceDrawUntilPlayable(hand, player);
    }

    let input: number;
    do {
      input = 1; //questionInt("Select a card to play by entering its number: ");

      if (input < 1 || input > hand.length) {
        console.log(
          `\x1b[1mInvalid input. Please select a number between 1 and ${hand.length}.\x1b[0m`
        );
      }
    } while (input < 1 || input > hand.length);
    playCard(input);
  };

  const drawCards = (player: Player, numberOfCards: number) => {
    for (let i = 0; i < numberOfCards; i++) {
      if (deck.size() === 0) {
        const topCard = discardPile.pop();
        deck.addCards(discardPile);

        discardPile.length = 0;
        if (topCard) discardPile.push(topCard);
        deck.shuffle();

        const card = deck.deal(1)[0];
        if (card) {
          player.hand.push(card);
        }
      }
    }
  };

  const canPlayCard = (card: Card): boolean => {
    const topCardFromDiscardPile = discardPile[discardPile.length - 1];

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

  const nextTurn = () => {
    selectCardToPlay(currentTurnIndex);
  };

  const checkForUNO = (player: Player) => {
    if (player.hand.length !== 1) return; //evac

    let duration = 5;
    let calledUno = false;

    const interval = setInterval(() => {
      console.log(`UNO! ${duration} seconds remaining...`);
      duration--;
    }, 1000);

    console.log("UNO!");

    const unoPrompt = () => {
      const input = "UNO "; //question("Type 'UNO' and press Enter to call UNO: "); // AW FUCK OFF THIS SHIT IS BLOCKING
      if (input.trim().toUpperCase() === "UNO") {
        calledUno = true;
        clearInterval(interval);
        console.log(`${player.name} successfully called UNO!`);
      }
    };

    unoPrompt();

    if (!calledUno) {
      clearInterval(interval);
      console.log(`
        ${player.name} failed to call UNO in time! Drawing 4 cards as a penalty.
      `);
      drawCards(player, 4);
    }
  };

  const endHand = () => {
    const winner = players.find((player) => player.hand.length === 0) || null;
    if (winner) {
      console.log(`${winner.name} won the hand!`);
    }
  };
  const isHandOver = (): boolean => {
    return players.some((player) => player.hand.length === 0);
  };

  //helpers
  //   const selectColour: Colour = () => {
  //     console.log("\nPlease choose a colour for the Wild Card!");
  //     console.log(`\x1b[31m [1] Red`);
  //     console.log("\x1b[34m [2] Blue");
  //     console.log("\x1b[32m [3] Green");
  //     console.log("\x1b[33m [4] Yellow");

  //     // const input = questionInt(
  //     //   "\x1b[35m Enter the number corresponding to your choice: \x1b[37m"
  //     // );
  //     // switch (input) {
  //     //   case 1:
  //     //     return "Red";
  //     //   case 2:
  //     //     return "Blue";
  //     //   case 3:
  //     //     return "Green";
  //     //   case 4:
  //     //     return "Yellow";
  //     //   default:
  //     //     return "Blue";
  //     // }

  //     return 'Blue';
  //   };

  const forceDrawUntilPlayable = (hand: Card[], player: Player) => {
    let isPlayable = hand.some((card) => canPlayCard(card));

    while (!isPlayable) {
      console.log(`${player.name}, no playable cards! You must draw a card.`);
      //question("Press Enter to draw a card...", { hideEchoBack: true });
      drawCards(player, 1);
      console.log(`
        \nYou drew: ${cardPrinter(player.hand[player.hand.length - 1])}
      `);

      // check the new hand after drawing
      isPlayable = player.hand.some((card) => canPlayCard(card));
      printPlayersHand(hand);
    }
  };

  const printPlayersHand = (hand: Card[]): void => {
    console.log(`Top card on the discard pile: ${cardPrinter(
      discardPile[discardPile.length - 1]
    )}
    `); //print out the top card here so the player has a reference to what can be played
    console.log(`\nYour hand [${hand.length}]: =>`);
    hand.forEach((card, index) => {
      console.log(cardPrinter(card, index + 1));
    });
  };
  return {
    checkForUNO,
    playCard,
    drawCards,
    nextTurn,
    discardPile,
    currentTurnIndex,
    endHand,
    isHandOver,
    deck,
  };
};

//todo: fix the deck so that it doesn't run out of cards
