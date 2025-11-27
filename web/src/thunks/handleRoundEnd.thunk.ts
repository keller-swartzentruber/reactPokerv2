import {
  selectCardsOnFelt,
  setRoundPayouts,
  setWaitingForRoundEndContinue,
} from "../app/gameDataSlice";
import { bulkUpdatePlayers, selectAllPlayers } from "../app/playersDataSlice";
import { AppDispatch, AppGetState } from "../app/store";
import {
  calculatePayoutsFromBets,
  calculatePlayersHandValues,
} from "../utils/roundEndCalculations";
import { handleRoundStart } from "./handleRoundStart.thunk";

// after all round of action have passed, calculate winner and handle upkeep
export const handleRoundEnd = () => {
  return (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    const players = selectAllPlayers(state);
    const centerCards = selectCardsOnFelt(state);
    const handValues = calculatePlayersHandValues(players, centerCards);
    const payouts = calculatePayoutsFromBets(players, handValues);

    dispatch(setRoundPayouts(payouts));
    dispatch(applyRoundPayouts(payouts));
    dispatch(removeBustedPlayers());
    dispatch(setWaitingForRoundEndContinue(true));
    // Wait for player to press continue button before clearing bets
  };
};

export const applyRoundPayouts = (payouts: Record<number, number>) => {
  return (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    const players = selectAllPlayers(state);
    const updatedPlayers = players.map((player) => ({
      ...player,
      stackSize: player.stackSize + (payouts[player.id] ?? 0),
    }));

    dispatch(bulkUpdatePlayers(updatedPlayers));
  };
};

export const removeBustedPlayers = () => {
  return (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    const players = selectAllPlayers(state);
    const remainingPlayers = players.filter((player) => player.stackSize > 0);
    if (remainingPlayers.length !== players.length) {
      dispatch(bulkUpdatePlayers(remainingPlayers));
    }
  };
};

// export const clearAllPlayerBets = () => {
//   return (dispatch: AppDispatch, getState: AppGetState) => {
//     const state = getState();
//     const players = selectAllPlayers(state);
//     const playersWithClearedBets = players.map((player) => ({
//       ...player,
//       betValue: 0,
//     }));
//     dispatch(bulkUpdatePlayers(playersWithClearedBets));
//   };
// };

export const continueAfterRoundEnd = () => {
  return (dispatch: AppDispatch, getState: AppGetState) => {
    // dispatch(clearAllPlayerBets());
    dispatch(setWaitingForRoundEndContinue(false));
    dispatch(setRoundPayouts(null));
    dispatch(handleRoundStart());
  };
};
