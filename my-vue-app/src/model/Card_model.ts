export type Colour = "Red" | "Blue" | "Green" | "Yellow" | "None";

type NumberedCard = {
  readonly type: "NUMBERED";
  readonly value: number;
  readonly colour: Colour;
};

type ActionCard =
  | { readonly type: "SKIP"; readonly colour: Colour }
  | { readonly type: "REVERSE"; readonly colour: Colour }
  | { readonly type: "DRAWTWO"; readonly colour: Colour };

type WildCard =
  | { readonly type: "WILD"; colour: Colour }
  | { readonly type: "WILDDRAWFOUR"; colour: Colour };

export type Card = NumberedCard | ActionCard | WildCard;

export type CardType = Card["type"];

export const cardPrinter = (card: Card, index?: number): string => {
  const prefix = index !== undefined ? `[${index}] ` : "";

  // ANSI color codes for each UNO color
  const colorMap: { [key in Colour]: string } = {
    Red: "\x1b[31m", // Red text
    Blue: "\x1b[34m", // Blue text
    Green: "\x1b[32m", // Green text
    Yellow: "\x1b[33m", // Yellow text
    None: "\x1b[37m", // White text for no color
  };

  const reset = "\x1b[0m"; // Resets color back to default

  const color = colorMap[card.colour] || colorMap.None; // Default to white

  switch (card.type) {
    case "NUMBERED":
      return `${color}${prefix}A ${card.colour} ${card.value}${reset}`;
    case "SKIP":
    case "REVERSE":
    case "DRAWTWO":
      return `${color}${prefix}A ${card.colour} ${card.type}${reset}`;
    case "WILD":
      return `${color}${prefix}A WILD CARD${reset}`;
    case "WILDDRAWFOUR":
      return `${color}${prefix}A WILD DRAW FOUR${reset}`;
    default:
      return `${color}${prefix}Unknown card type${reset}`;
  }
};
