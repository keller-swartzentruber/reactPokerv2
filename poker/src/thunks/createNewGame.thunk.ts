import {
  selectInitialStackSize,
  selectNumberOfPlayers,
  selectPlayerName,
} from "../app/setupDataSlice";
import { AppDispatch, AppGetState } from "../app/store";
import { setCardsOnFelt } from "../app/gameDataSlice";
import { createPlayer } from "../app/playersDataSlice";
import { deal, getNewBlinds, shuffleArray } from "../utils/pokerUtils";
import { handleRoundStart } from "./handleRoundStart.thunk";

export const createNewGame = () => {
  return async (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    const numberOfPlayers = selectNumberOfPlayers(state);
    const playerName = selectPlayerName(state);
    const numberOfOpponents = numberOfPlayers - 1;
    const initialStackSize = selectInitialStackSize(state);
    const startingDealer = Math.floor(Math.random() * numberOfPlayers);
    const startingBlinds = getNewBlinds(numberOfPlayers, startingDealer);

    dispatch(
      createPlayer({
        id: 0,
        name: playerName,
        stackSize: initialStackSize,
        blindType: startingBlinds[0],
        betValue: 0,
        folded: false,
        cards: [],
        priorityPassed: false,
        activePlayer: false,
      })
    );

    let opponentNames = theFunny;

    for (let i = 0; i < numberOfOpponents; i++) {
      opponentNames = shuffleArray(opponentNames);
      dispatch(
        createPlayer({
          id: i + 1,
          name: opponentNames.pop() ?? "whoops",
          stackSize: initialStackSize,
          blindType: startingBlinds[i + 1],
          betValue: 0,
          folded: false,
          cards: [],
          priorityPassed: false,
          activePlayer: false,
        })
      );
    }
    dispatch(handleRoundStart());
  };
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
