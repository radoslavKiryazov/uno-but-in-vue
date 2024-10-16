import type { Player } from "./Player_model";
import type { Hand } from "./Hand_model";
import { createHand } from "./Hand_model";

export type GameState = "ONGOING" | "ENDED";

export type Game = {
  /** The Players*/
  players: Player[];
  /** Gets the current hand*/
  getCurrentHand: () => Hand | null;
  /** Target score needed to win the game */
  targetScore: number;
  /** Start a new hand */
  startNewHand: () => void;
  /** Updates the players' scores after each hand */
  updateScores: () => void;
  /** Checks if the game is over based on the players' scores */
  isGameOver: () => boolean;
  /** Returns the winner of the game */
  getWinner: () => Player | null;
  /** Starts the game*/
  playGame: () => void;
};

export const createGame = (players: Player[], targetScore = 500): Game => {
  let currentHand: Hand | null = null;
  console.log("players", players);

  const startNewHand = (): void => {
    console.log("\n--- A new hand begins! ---\n");
    currentHand = createHand(players);
    currentHand.nextTurn();
  };

  const updateScores = () => {
    const handWinner = players.find((player) => player.hand.length === 0);
    if (handWinner) {
      const points = pointCalculator(players, handWinner);
      handWinner.score += points;
      console.log(
        `${handWinner.name} wins the hand and earns ${points} points!`
      );
      console.log(
        `Current scores: ${players
          .map((p) => `${p.name}: ${p.score}`)
          .join(", ")}`
      );
    }
  };

  const isGameOver = (): boolean => {
    return players.some((player) => player.score >= targetScore);
  };

  const getWinner = (): Player | null => {
    return players.find((player) => player.score >= targetScore) || null;
  };

  const playGame = (): void => {
    console.log("\n--- The game begins! ---\n");

    while (!isGameOver()) {
      startNewHand();
      while (!currentHand?.isHandOver()) {}
      updateScores();
    }

    const winner = getWinner();
    if (winner) {
      console.log(`\n--- Game Over! ${winner.name} wins the game! ---\n`);
    }
  };

  const getCurrentHand = (): Hand | null => {
    return currentHand;
  };

  return {
    players,
    getCurrentHand,
    targetScore,
    startNewHand,
    updateScores,
    isGameOver,
    getWinner,
    playGame,
  };
};

const pointCalculator = (players: Player[], winner: Player): number => {
  let totalPoints = 0;

  players.forEach((player) => {
    if (player !== winner) {
      player.hand.forEach((card) => {
        if (card.type === "NUMBERED") {
          totalPoints += card.value || 0;
        } else {
          // assign point values for special cards
          totalPoints +=
            card.type === "WILD" || card.type === "WILDDRAWFOUR" ? 50 : 20;
        }
      });
    }
  });

  return totalPoints;
};
