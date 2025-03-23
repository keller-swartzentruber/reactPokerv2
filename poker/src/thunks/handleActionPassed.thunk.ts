import { selectCurrentBet, updateCurrentBet } from "../app/gameDataSlice";
import {
  playerBetAmount,
  playerFolded,
  playerRaised,
  selectOpponents,
  selectPlayerById,
} from "../app/playersDataSlice";
import { AppDispatch, AppGetState } from "../app/store";
import { advanceGameState } from "./advanceGameState.thunk";

// after player has taken an action, current bet should be updated
export const handleActionPassed = () => {
  return async (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    const opponents = selectOpponents(state);

    let nextRoundStarted = false;

    opponents.forEach((opponent, index) => {
      if (opponent.folded !== true && opponent.stackSize !== 0) {
        if (opponent.priorityPassed === true) {
          nextRoundStarted = true;
          return;
        }
        // give player time to see action
        setTimeout(() => {
          dispatch(handleOpponentTurn(opponent.id));
        }, 1000 * (index + 1));
      }
    });

    setTimeout(() => {
      if (nextRoundStarted) {
        dispatch(advanceGameState());
        return;
      } else {
        const player = selectPlayerById(state, 0);
        if (player.folded === true) {
          dispatch(handleActionPassed()); // no brakes
        } else if (player.priorityPassed === true) {
          dispatch(advanceGameState());
        }
      }
    }, 1000 * (opponents.length + 1));

    // check if player gets action
  };

  // for each opponent
  //  if not folded or all in
  //    fold, raise, call
  //    add a couple second wait between each
  //
};

export const handleOpponentTurn = (id: number) => {
  return (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    const playerUp = selectPlayerById(state, id);
    const currentBet = selectCurrentBet(state);
    const visibleCards = () => {}; // implement this;

    const randomDecision = Math.floor(Math.random() * 100);

    // player folds
    if (randomDecision < 10) {
      dispatch(playerFolded(id));
      // player calls and priority is passed
    } else if (randomDecision < 90 || playerUp.stackSize <= currentBet) {
      if (playerUp.stackSize < currentBet) {
        // player calls all in
        dispatch(playerBetAmount({ id: id, betAmount: playerUp.stackSize }));
      } else {
        // player calls
        dispatch(playerBetAmount({ id: id, betAmount: currentBet }));
      }
      // player raises and priority is reset for all players except raiser
    } else {
      const randomRaiseAmount = Math.floor(Math.random() * 3) + 1;
      const raiseValue = randomRaiseAmount * currentBet;
      if (playerUp.stackSize < raiseValue) {
        dispatch(updateCurrentBet(playerUp.stackSize));
        dispatch(playerBetAmount({ id: id, betAmount: playerUp.stackSize }));
        dispatch(playerRaised(id));
      } else {
        dispatch(updateCurrentBet(raiseValue));
        dispatch(playerBetAmount({ id: id, betAmount: raiseValue }));
        dispatch(playerRaised(id));
      }
    }
  };
};
