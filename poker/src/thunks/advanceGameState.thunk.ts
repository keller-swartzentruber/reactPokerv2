import {
  selectCardsOnFelt,
  selectGameState,
  setCardsOnFelt,
  updateGameState,
} from "../app/gameDataSlice";
import { bulkUpdatePlayers, selectAllPlayers } from "../app/playersDataSlice";
import { AppDispatch, AppGetState } from "../app/store";
import { GameState } from "../enums/GameState";
import { Player } from "../models/player.model";
import { deal } from "../utils/pokerUtils";
import { handleNewRound } from "./handleNewRound.thunk";

export const advanceGameState = () => {
  return async (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    const previousGameState = selectGameState(state);

    const newGameState =
      previousGameState + 1 > GameState.PostRiver
        ? GameState.PreFlop
        : previousGameState + 1;

    if (newGameState === GameState.PreFlop) {
      dispatch(handleNewRound());
    }
    dispatch(handleCenterCardsOnGameStateChange(newGameState));
    if (newGameState === GameState.PostRiver) {
      dispatch(flipOpponentCards());
    }

    dispatch(updateGameState(newGameState));
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
    const newPlayers: Player[] = [];
    for (const player of players) {
      newPlayers.push({
        ...player,
        cards: player.cards.map((c) => {
          return {
            ...c,
            isShown: true,
          };
        }),
      });
    }
    dispatch(bulkUpdatePlayers(newPlayers));
  };
};
