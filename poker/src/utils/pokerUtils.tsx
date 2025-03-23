import { BlindType } from "../enums/BlindType";
import { Card } from "../models/card.model";

// split out if needed

export const deal = (): Card[] => {
  let deck: Card[] = [];
  for (let s = 0; s < 4; s++) {
    for (let i = 1; i < 14; i++) {
      deck.push({
        value: i,
        suit: s,
        photoMap: i + "_" + s,
        isShown: false,
      });
    }
  }
  // shuffle
  deck = shuffleArray(deck);
  console.log(deck);
  return deck;
};

export const shuffleArray = <T,>(values: T[]): T[] => {
  let localArray = [...values];
  for (let i = localArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [localArray[i], localArray[j]] = [localArray[j], localArray[i]];
  }
  return localArray;
};

export const getNewBlinds = (
  numberOfPlayers: number,
  currentDealer: number
): BlindType[] => {
  const nextDealer =
    currentDealer + 1 >= numberOfPlayers ? 0 : currentDealer + 1;
  const nextSmallBlind = nextDealer + 1 >= numberOfPlayers ? 0 : nextDealer + 1;
  const nextBigBlind =
    nextSmallBlind + 1 >= numberOfPlayers ? 0 : nextSmallBlind + 1;
  const newBlinds: BlindType[] = [];
  for (let i = 0; i < numberOfPlayers; i++) {
    if (i === nextDealer) {
      newBlinds.push(BlindType.Dealer);
    } else if (i === nextSmallBlind) {
      newBlinds.push(BlindType.SmallBlind);
    } else if (i === nextBigBlind) {
      newBlinds.push(BlindType.BigBlind);
    } else {
      newBlinds.push(BlindType.NoBlind);
    }
  }
  return newBlinds;
};
