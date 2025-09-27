import {
  selectCardsOnFelt,
  selectGameState,
  setCardsOnFelt,
  updateGameState,
} from "../app/gameDataSlice";
import {
  bulkUpdatePlayers,
  newRoundPrioritySet,
  selectAllPlayers,
  selectDoesPlayContinue,
  selectLittleBlindIndex,
  selectPlayerById,
} from "../app/playersDataSlice";
import { AppDispatch, AppGetState } from "../app/store";
import { GameState } from "../enums/GameState";
import { Player } from "../models/player.model";
import { handleActionPassed } from "./handleActionPassed.thunk";
import { handleRoundEnd } from "./handleRoundEnd.thunk";
import { handleRoundStart } from "./handleRoundStart.thunk";

export const advanceGameState = () => {
  return async (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    const previousGameState = selectGameState(state);

    const newGameState =
      previousGameState + 1 > GameState.PostRiver
        ? GameState.PreFlop
        : previousGameState + 1;

    if (newGameState === GameState.PreFlop) {
      dispatch(handleRoundStart());
    }
    dispatch(handleCenterCardsOnGameStateChange(newGameState));
    dispatch(newRoundPrioritySet()); // set all prios to false
    dispatch(updateGameState(newGameState));

    // if the round isn't over
    if (newGameState !== GameState.PostRiver) {
      // start again at little blind, checking to ensure player isn't up
      const startingPlayerIndex = selectLittleBlindIndex(state);
      if (startingPlayerIndex === 0) {
        const player = selectPlayerById(state, 0);
        if (player.folded) {
          dispatch(handleActionPassed(0));
        }
      } else {
        dispatch(handleActionPassed(startingPlayerIndex - 1));
      }
    } else {
      dispatch(flipOpponentCards());
      setTimeout(() => {
        dispatch(handleRoundEnd());
      }, 500);
    }
  };
};

export const handleCenterCardsOnGameStateChange = (newGameState: GameState) => {
  return async (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    let centerCards = selectCardsOnFelt(state);
    let heldCards = [];
    switch (newGameState) {
      case GameState.Flop:
        heldCards = centerCards.slice(3);
        centerCards = centerCards
          .slice(0, 3)
          .map((c) => {
            return {
              ...c,
              isShown: true,
            };
          })
          .concat(heldCards);
        break;
      case GameState.Turn:
        heldCards = centerCards.slice(4);
        centerCards = centerCards
          .slice(0, 4)
          .map((c) => {
            return {
              ...c,
              isShown: true,
            };
          })
          .concat(heldCards);
        break;
      case GameState.River:
        centerCards = centerCards.map((c) => {
          return {
            ...c,
            isShown: true,
          };
        });
        break;
    }
    dispatch(setCardsOnFelt(centerCards));
  };
};

export const flipOpponentCards = () => {
  return async (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    const players = selectAllPlayers(state);
    let newPlayers: Player[] = [];
    for (const player of players) {
      newPlayers = [
        ...newPlayers,
        {
          ...player,
          cards: player.cards.map((c) => {
            return {
              ...c,
              isShown: true,
            };
          }),
        },
      ];
    }
    dispatch(bulkUpdatePlayers(newPlayers));
  };
};
