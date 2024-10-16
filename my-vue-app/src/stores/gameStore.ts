import { defineStore } from "pinia";
import type { Player } from "../model/Player_model";
import { createPlayer } from "../model/Player_model";
import type { Hand } from "../model/Hand_model";
import { createHand } from "../model/Hand_model";
import { ref, computed } from "vue";
import { canPlayCard } from "../utils/random_utils";
import type { Colour } from "../model/Card_model";

export const useGameStore = defineStore("model", () => {
  const colourPopupTrigger = ref({
    buttonTrigger: false,
    timeTrigger: false,
  });

  const selectedWildColour = ref(null as string | null);
  const directionOfPlay = ref(1); // 1 for clockwise, -1 for counter-clockwise

  const players = ref([] as Player[]);
  const currentHand = ref(null as Hand | null);
  const handsPlayed = ref(0 as number);
  const playerName = ref("" as string);
  const playerAtHandIndex = ref(0 as number);

  const startGame = (playerName: string, numberOfBots: number) => {
    const newPlayers: Player[] = [
      createPlayer(playerName, [], false),
      ...Array.from({ length: numberOfBots }, (_, i) =>
        createPlayer(`Bot ${i + 1}`, [], true)
      ),
    ];
    players.value = newPlayers;

    currentHand.value = createHand(players.value);
  };

  const playCard = (cardIndex: number) => {
    const currentPlayer = players.value[playerAtHandIndex.value];

    if (cardIndex < 0 || cardIndex >= currentPlayer.hand.length) {
      console.error("Invalid card index:", cardIndex);
      return;
    }

    let selectedCard = currentPlayer.hand[cardIndex];

    if (!selectedCard) {
      console.error("Selected card is undefined:", selectedCard);
      return;
    }

    console.log(
      `${currentPlayer.name} played a ${selectedCard.colour} ${selectedCard.type} card!`
    );

    currentPlayer.hand.splice(cardIndex, 1);

    switch (selectedCard.type) {
      case "NUMBERED": {
        console.log("Numbered card played!");
        updatePlayerAtHandIndex();
        break;
      }
      case "SKIP": {
        skipPlayerTurn();
        console.log("playerAtHandIndex", playerAtHandIndex.value);
        break;
      }
      case "REVERSE": {
        directionOfPlay.value *= -1;
        console.log("Order of play has been reversed!");
        if (players.value.length === 2) {
          updatePlayerAtHandIndex();
        }
        updatePlayerAtHandIndex();
        break;
      }
      case "DRAWTWO": {
        const nextPlayerIndex =
          (playerAtHandIndex.value + directionOfPlay.value) %
          players.value.length;

        const nextPlayer = players.value[nextPlayerIndex];
        if (!currentHand.value || !currentHand.value.deck.size()) {
          console.log("Deck is empty. Reshuffling discard pile...");
          return;
        }

        const drawnCards = currentHand.value.deck.deal(2);
        if (drawnCards) {
          nextPlayer.hand.push(...drawnCards);
        } else {
          console.error("No card drawn");
        }
        updatePlayerAtHandIndex();
        break;
      }
      case "WILD": {
        handleWildCard();
        updatePlayerAtHandIndex();
        break;
      }
      case "WILDDRAWFOUR": {
        handleWildCard();
        const nextPlayerIndex =
          (playerAtHandIndex.value + directionOfPlay.value) %
          players.value.length;

        const nextPlayer = players.value[nextPlayerIndex];
        if (!currentHand.value || !currentHand.value.deck.size()) {
          console.log("Deck is empty. Reshuffling discard pile...");
          return;
        }

        const drawnCards = currentHand.value.deck.deal(4);
        if (drawnCards) {
          nextPlayer.hand.push(...drawnCards);
        } else {
          console.error("No card drawn");
        }
        skipPlayerTurn();
        break;
      }
    }

    if (currentHand.value) {
      currentHand.value.discardPile.push(selectedCard);
    }

    if (
      !colourPopupTrigger.value.buttonTrigger &&
      players.value[playerAtHandIndex.value].isBot
    ) {
      botPlay();
    }
  };

  const drawCard = (playerIndex: number) => {
    const currentPlayer = players.value[playerIndex];
    console.log("Drawing card for", currentPlayer);

    if (!currentHand.value || !currentHand.value.deck.size()) {
      console.log("Deck is empty. Reshuffling discard pile...");
      return;
    }

    const drawnCards = currentHand.value.deck.deal(1);
    const drawnCard = drawnCards[0];

    if (drawnCard) {
      currentPlayer.hand.push(drawnCard);
    } else {
      console.error("No card drawn");
    }

    console.log("Updated player hand after drawing:", currentPlayer.hand);
    console.log("Remaining deck size:", currentHand.value.deck.size());

    if (players.value[playerAtHandIndex.value].isBot) {
      botPlay();
    }
  };

  const handleWildCard = () => {
    const currentPlayer = players.value[playerAtHandIndex.value];

    if (currentPlayer.isBot) {
      const colours = currentPlayer.hand
        .map((card) => card.colour)
        .filter((color) => color !== "None");
      console.log("botColors", colours);

      const colorFrequencies = colours.reduce(
        (acc: { [key: string]: number }, color: string) => {
          acc[color] = (acc[color] || 0) + 1;
          return acc;
        },
        {}
      );

      const mostFrequentColour = Object.keys(colorFrequencies).reduce((a, b) =>
        colorFrequencies[a] > colorFrequencies[b] ? a : b
      );

      console.log("Most frequent color:", mostFrequentColour);
      selectedWildColour.value = mostFrequentColour as Colour;
      changeTopCardColor(mostFrequentColour as Colour);
    } else {
      colourPopupTrigger.value.buttonTrigger = true;
    }
  };

  const updatePlayerAtHandIndex = () => {
    console.log("playerAtHandIndex", playerAtHandIndex.value);
    console.log("UPDATEDplayerAtHandIndex", playerAtHandIndex.value);
    playerAtHandIndex.value =
      (playerAtHandIndex.value + directionOfPlay.value + players.value.length) %
      players.value.length;
  };

  const skipPlayerTurn = () => {
    playerAtHandIndex.value =
      (playerAtHandIndex.value +
        directionOfPlay.value * 2 +
        players.value.length) %
      players.value.length;
  };

  const onColourSelection = (colour: Colour) => {
    console.log("Selected colour:", colour);
    selectedWildColour.value = colour;
    colourPopupTrigger.value.buttonTrigger = false;
    changeTopCardColor(colour);
    if (players.value[playerAtHandIndex.value].isBot) {
      botPlay();
    }
  };

  const changeTopCardColor = (color: Colour) => {
    if (discardPile && discardPile.value && discardPile.value.length > 0) {
      const topCard = discardPile.value[discardPile.value.length - 1];
      if (topCard.type === "WILD" || topCard.type === "WILDDRAWFOUR") {
        topCard.colour = color;
      }
    }
  };

  const botPlay = () => {
    const botIndex = playerAtHandIndex.value; // Store the index at the start of the function
    const bot = players.value[botIndex];

    const playableCardIndex = bot.hand.findIndex((card) =>
      canPlayCard(card, topDiscardCard.value)
    );

    if (playableCardIndex !== -1) {
      setTimeout(() => playCard(playableCardIndex), 3000);
    } else {
      setTimeout(() => drawCard(botIndex), 3000);
    }
  };

  const getPlayerHand = computed(() =>
    players.value.length > 0 ? players.value[0].hand : []
  );

  const isThereAPlayableCard = computed(() =>
    players.value[0].hand.some((card) =>
      canPlayCard(card, topDiscardCard.value)
    )
  );
  const getCurrentHand = computed(() => currentHand.value);
  const discardPile = computed(() => currentHand.value?.discardPile);
  const deck = computed(() => currentHand.value?.deck);
  const topDiscardCard = computed(() => {
    return discardPile.value?.[discardPile.value.length - 1];
  });

  return {
    startGame,
    players,
    currentHand,
    handsPlayed,
    playerName,
    getPlayerHand,
    discardPile,
    getCurrentHand,
    deck,
    playCard,
    topDiscardCard,
    isThereAPlayableCard,
    drawCard,
    playerAtHandIndex,
    colourPopupTrigger,
    onColourSelection,
  };
});
