import {
  selectInitialStackSize,
  selectNumberOfPlayers,
  selectPlayerName,
} from "../app/setupDataSlice";
import { AppDispatch, AppGetState } from "../app/store";
import { Card } from "../models/card.model";
import { setCardsOnFelt } from "../app/gameDataSlice";
import { createPlayer } from "../app/playersDataSlice";
import { BlindType } from "../enums/BlindType";

export const createNewGame = () => {
  return async (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    const numberOfPlayers = selectNumberOfPlayers(state);
    const playerName = selectPlayerName(state);
    const numberOfOpponents = numberOfPlayers - 1;
    const initialStackSize = selectInitialStackSize(state);
    const deck = deal();
    const startingDealer = Math.floor(Math.random() * (numberOfPlayers + 1));
    const startingBlinds = getNewBlinds(numberOfPlayers, startingDealer);

    dispatch(setCardsOnFelt(deck.splice(0, 5)));

    dispatch(
      createPlayer({
        id: 0,
        name: playerName,
        cardsShown: true,
        stackSize: initialStackSize,
        blindType: startingBlinds[0],
        betValue: 0,
        folded: false,
        cards: deck.splice(0, 2),
      })
    );

    let opponentNames = theFunny;

    for (let i = 0; i < numberOfOpponents; i++) {
      opponentNames = shuffleArray(opponentNames);
      dispatch(
        createPlayer({
          id: i + 1,
          name: opponentNames.pop() ?? "whoops",
          cardsShown: false,
          stackSize: initialStackSize,
          blindType: startingBlinds[i + 1],
          betValue: 0,
          folded: false,
          cards: deck.splice(0, 2),
        })
      );
    }
  };
};

// move below to utils

const deal = (): Card[] => {
  let deck: Card[] = [];
  for (let s = 0; s < 4; s++) {
    for (let i = 1; i < 14; i++) {
      deck.push({
        value: i,
        suit: s,
        photoMap: i + "_" + s,
      });
    }
  }
  // shuffle
  deck = shuffleArray(deck);
  console.log(deck);
  return deck;
};

const shuffleArray = <T>(values: T[]): T[] => {
  let localArray = [...values];
  for (let i = localArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [localArray[i], localArray[j]] = [localArray[j], localArray[i]];
  }
  return localArray;
};

const getNewBlinds = (
  numberOfPlayers: number,
  currentDealer: number
): BlindType[] => {
  const nextDealer =
    currentDealer + 1 > numberOfPlayers ? 0 : currentDealer + 1;
  const nextSmallBlind = nextDealer + 1 > numberOfPlayers ? 0 : nextDealer + 1;
  const nextBigBlind =
    nextSmallBlind + 1 > numberOfPlayers ? 0 : nextSmallBlind + 1;
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

const theFunny = [
  "El Chip",
  "Stranger In Town",
  "Odd Ruffian",
  "Roberto the Fourth",
  "Lost Tourist",
  "Drunk Sailor",
  "Aging Card Shark",
  "Willem DaFoe",
  "Player X",
  "The Whale",
  "3 cacti in a trenchcoat",
  "sleeping drunkard",
];
