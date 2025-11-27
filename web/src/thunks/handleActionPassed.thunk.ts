import {
  selectCurrentBet,
  updateCurrentBet,
  updatePlayerHasAction,
} from "../app/gameDataSlice";
import {
  selectAllPlayers,
  selectDoesPlayContinue,
  playerBetAmount,
  playerFolded,
  playerRaised,
  selectOpponents,
  selectPlayerById,
} from "../app/playersDataSlice";
import { AppDispatch, AppGetState } from "../app/store";
import { advanceGameState } from "./advanceGameState.thunk";
import { decideOpponentAction } from "../utils/opponentDecision";

// Helper function to check if betting round should end
const shouldEndBettingRound = (state: ReturnType<AppGetState>): boolean => {
  const players = selectAllPlayers(state);
  const currentBet = selectCurrentBet(state);

  // Get all active players (not folded, have stack)
  const activePlayers = players.filter((p) => !p.folded && p.stackSize > 0);

  if (activePlayers.length <= 1) {
    return true;
  }

  // Check if all active players have passed priority AND matched the current bet
  const allPlayersMatched = activePlayers.every(
    (p) => p.priorityPassed === true && p.betValue === currentBet
  );

  return allPlayersMatched;
};

// starts a betting round starting with startingOpponent (index - 1)
export const handleActionPassed = (startingOpponent: number) => {
  return async (dispatch: AppDispatch, getState: AppGetState) => {
    // player loses interaction buttons
    dispatch(updatePlayerHasAction(false));

    const state = getState();
    // all opponents that will get a bet
    const opponents = selectOpponents(state);
    const opponentsPlaying = opponents.slice(startingOpponent);
    const delay = (ms: number) =>
      new Promise<void>((resolve) => setTimeout(resolve, ms));

    // run each opponent turn sequentially
    for (const opponent of opponentsPlaying) {
      if (opponent.folded === true || opponent.stackSize === 0) {
        continue;
      }

      // Check if this opponent needs to act (hasn't passed priority or hasn't matched bet)
      const currentState = getState();
      const currentBet = selectCurrentBet(currentState);
      const needsToAct =
        !opponent.priorityPassed || opponent.betValue !== currentBet;

      if (!needsToAct) {
        // This opponent has already acted and matched the bet, continue to next
        continue;
      }

      // give player time to see action
      await delay(500);
      dispatch(handleOpponentTurn(opponent.id));

      // Check if round should end after this action
      const stateAfterAction = getState();
      if (shouldEndBettingRound(stateAfterAction)) {
        break;
      }
    }

    setTimeout(() => {
      const latestState = getState();

      // Check if betting round should end (all active players have matched bet)
      if (shouldEndBettingRound(latestState)) {
        dispatch(advanceGameState());
        return;
      }

      const player = selectPlayerById(latestState, 0);
      if (player.folded === true) {
        dispatch(handleActionPassed(0));
      } else {
        // Check if player needs to act
        const currentBet = selectCurrentBet(latestState);
        const playerNeedsToAct =
          !player.priorityPassed || player.betValue !== currentBet;

        if (playerNeedsToAct) {
          dispatch(updatePlayerHasAction(true));
        } else {
          // Player has acted, check if round should end
          if (shouldEndBettingRound(latestState)) {
            dispatch(advanceGameState());
          } else {
            // Continue with next player
            dispatch(handleActionPassed(0));
          }
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
    const opponentAction = decideOpponentAction(playerUp, currentBet);

    switch (opponentAction.type) {
      case "fold":
        dispatch(playerFolded(id));
        break;
      case "call":
        dispatch(
          playerBetAmount({
            id,
            betAmount: opponentAction.amount,
          })
        );
        break;
      case "raise":
        dispatch(updateCurrentBet(opponentAction.newCurrentBet));
        dispatch(playerBetAmount({ id, betAmount: opponentAction.betAmount }));
        dispatch(playerRaised(id));
        break;
    }
    return false;
  };
};
