import { BlindType } from "../enums/BlindType";
import { Card } from "../models/card.model";

// creates a shuffled array of all cards
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

// shuffles an array using random index swapping
export const shuffleArray = <T,>(values: T[]): T[] => {
  let localArray = [...values];
  for (let i = localArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [localArray[i], localArray[j]] = [localArray[j], localArray[i]];
  }
  return localArray;
};

// returns array in turn order of new blinds
export const getNewBlinds = (
  numberOfPlayers: number,
  currentLittleBlind: number
): BlindType[] => {
  const nextDealer = currentLittleBlind;
  const nextSmallBlind = nextDealer + 1 >= numberOfPlayers ? 0 : nextDealer + 1;
  const nextBigBlind =
    nextSmallBlind + 1 >= numberOfPlayers ? 0 : nextSmallBlind + 1;
  const newBlinds: BlindType[] = [];
  for (let i = 0; i < numberOfPlayers; i++) {
    if (i === nextSmallBlind) {
      newBlinds.push(BlindType.SmallBlind);
    } else if (i === nextBigBlind) {
      newBlinds.push(BlindType.BigBlind);
    } else if (i === nextDealer) {
      // dealer needs to be lower so dealer isn't added in two player
      newBlinds.push(BlindType.Dealer);
    } else {
      newBlinds.push(BlindType.NoBlind);
    }
  }
  return newBlinds;
};
