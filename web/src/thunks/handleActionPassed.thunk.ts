import {
  selectCardsOnFelt,
  selectCurrentBet,
  updateCurrentBet,
  updatePlayerHasAction,
} from "../app/gameDataSlice";
import { BlindType } from "../enums/BlindType";
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
import { getMove, GameState as AiGameState } from "../ai-move-query.api";

const shouldEndBettingRound = (state: ReturnType<AppGetState>): boolean => {
  const players = selectAllPlayers(state);
  const currentBet = selectCurrentBet(state);

  const activePlayers = players.filter((p) => !p.folded && p.stackSize > 0);

  if (activePlayers.length <= 1) {
    return true;
  }

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

    for (const opponent of opponentsPlaying) {
      if (opponent.folded === true || opponent.stackSize === 0) {
        continue;
      }

      const currentState = getState();
      const currentBet = selectCurrentBet(currentState);
      const needsToAct =
        !opponent.priorityPassed || opponent.betValue !== currentBet;

      if (!needsToAct) {
        continue;
      }

      // give player time to see action
      await delay(500);
      await dispatch(handleOpponentTurn(opponent.id) as any);

      const stateAfterAction = getState();
      if (shouldEndBettingRound(stateAfterAction)) {
        break;
      }
    }

    setTimeout(() => {
      const latestState = getState();

      if (shouldEndBettingRound(latestState)) {
        dispatch(advanceGameState());
        return;
      }

      const player = selectPlayerById(latestState, 0);
      if (player.folded === true) {
        dispatch(handleActionPassed(0));
      } else {
        const currentBet = selectCurrentBet(latestState);
        const playerNeedsToAct =
          !player.priorityPassed || player.betValue !== currentBet;

        if (playerNeedsToAct) {
          dispatch(updatePlayerHasAction(true));
        } else {
          if (shouldEndBettingRound(latestState)) {
            dispatch(advanceGameState());
          } else {
            dispatch(handleActionPassed(0));
          }
        }
      }
    }, 500);
  };
};

// returns if play has finished early due to all players folding or being all in
export const handleOpponentTurn = (id: number) => {
  return async (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    const getsTurn = selectDoesPlayContinue(state);
    if (!getsTurn) {
      return true;
    }
    const playerUp = selectPlayerById(state, id);
    const cardsOnFelt = selectCardsOnFelt(state);
    const allPlayers = selectAllPlayers(state);
    const currentBet = selectCurrentBet(state);

    const pot = allPlayers.reduce((sum, p) => sum + p.betValue, 0);

    const dealerIndex = allPlayers.findIndex(
      (p) => p.blindType === BlindType.Dealer
    );
    const playerIndex = allPlayers.findIndex((p) => p.id === id);

    let positionFromDealer = 0;
    if (dealerIndex >= 0 && playerIndex >= 0 && allPlayers.length > 0) {
      positionFromDealer = playerIndex - dealerIndex;
      if (positionFromDealer < 0) {
        positionFromDealer += allPlayers.length;
      }
    }

    const gameStateForAi: AiGameState = {
      player_hand: playerUp.cards.map((card) => ({
        value: card.value,
        suit: card.suit,
      })),
      community_cards: cardsOnFelt.map((card) => ({
        value: card.value,
        suit: card.suit,
      })),
      pot,
      player_stack: playerUp.stackSize,
      current_bet: currentBet,
      position_from_dealer: positionFromDealer,
    };

    // Call out to AI service for move suggestion (result currently unused)
    await getMove(gameStateForAi);

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
