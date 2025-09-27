import {
  selectCurrentBet,
  updateCurrentBet,
  updatePlayerHasAction,
} from "../app/gameDataSlice";
import {
  selectDoesPlayContinue,
  playerBetAmount,
  playerFolded,
  playerRaised,
  selectOpponents,
  selectPlayerById,
} from "../app/playersDataSlice";
import { AppDispatch, AppGetState } from "../app/store";
import { advanceGameState } from "./advanceGameState.thunk";

// starts a betting round starting with startingOpponent (index - 1)
export const handleActionPassed = (startingOpponent: number) => {
  return async (dispatch: AppDispatch, getState: AppGetState) => {
    let nextRoundStarted = false;
    const state = getState();
    const getsTurn = selectDoesPlayContinue(state);
    if (!getsTurn) {
      nextRoundStarted = true;
    }

    // player loses interaction buttons
    dispatch(updatePlayerHasAction(false));

    // all opponents that will get a bet
    const opponents = selectOpponents(state);
    const opponentsPlaying = opponents.slice(startingOpponent);
    const opponentTurns = opponentsPlaying.map((opponent, index) => {
      return new Promise<void>((resolve) => {
        if (opponent.folded !== true && opponent.stackSize !== 0) {
          if (opponent.priorityPassed === true) {
            nextRoundStarted = true;
            resolve();
            return;
          }
          // give player time to see action
          setTimeout(() => {
            const playEnded = dispatch(handleOpponentTurn(opponent.id));
            if (playEnded) nextRoundStarted = true;
            resolve();
          }, 500 * (index + 1));
        } else {
          resolve();
        }
      });
    });

    // only advance game state or recurse after all opponent turns have resolved
    await Promise.all(opponentTurns);
    setTimeout(() => {
      if (nextRoundStarted) {
        dispatch(advanceGameState());
        return;
      } else {
        const player = selectPlayerById(state, 0);
        if (player.folded === true) {
          dispatch(handleActionPassed(0));
        } else if (player.priorityPassed === true) {
          dispatch(advanceGameState());
        } else {
          dispatch(updatePlayerHasAction(true));
        }
      }
    }, 500);
  };
};

// returns if play has finished early due to all players folding or being all in
export const handleOpponentTurn = (id: number) => {
  return (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    const getsTurn = selectDoesPlayContinue(state);
    if (!getsTurn) {
      return true;
    }
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
    return false;
  };
};
