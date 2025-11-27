import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Player } from "../models/player.model";
import { SetupDataState } from "./setupDataSlice";
import { RootState } from "./store";
import { Card } from "../models/card.model";
import { GameState } from "../enums/GameState";

export interface GameDataState {
  cardsOnFelt: Card[];
  currentBet: number;
  gameState: GameState;
  playerHasAction: boolean;
  roundPayouts: Record<number, number> | null;
  waitingForRoundEndContinue: boolean;
}

const initialState: GameDataState = {
  cardsOnFelt: [],
  currentBet: 0,
  gameState: GameState.PreFlop,
  playerHasAction: true,
  roundPayouts: null,
  waitingForRoundEndContinue: false,
};

export const gameDataSlice = createSlice({
  name: "gameData",
  initialState: initialState,
  reducers: {
    setCardsOnFelt(state: GameDataState, action: PayloadAction<Card[]>) {
      state.cardsOnFelt = action.payload;
    },
    updateGameState(state: GameDataState, action: PayloadAction<GameState>) {
      state.gameState = action.payload;
    },
    updateCurrentBet(state: GameDataState, action: PayloadAction<number>) {
      state.currentBet = action.payload;
    },
    updatePlayerHasAction(
      state: GameDataState,
      action: PayloadAction<boolean>
    ) {
      state.playerHasAction = action.payload;
    },
    setRoundPayouts(
      state: GameDataState,
      action: PayloadAction<Record<number, number> | null>
    ) {
      state.roundPayouts = action.payload;
    },
    setWaitingForRoundEndContinue(
      state: GameDataState,
      action: PayloadAction<boolean>
    ) {
      state.waitingForRoundEndContinue = action.payload;
    },
  },
});

export const {
  setCardsOnFelt,
  updateGameState,
  updateCurrentBet,
  updatePlayerHasAction,
  setRoundPayouts,
  setWaitingForRoundEndContinue,
} = gameDataSlice.actions;

export const selectCardsOnFelt = (state: RootState): Card[] =>
  state.gameData.cardsOnFelt;

export const selectGameState = (state: RootState): GameState =>
  state.gameData.gameState;

export const selectCurrentBet = (state: RootState): number =>
  state.gameData.currentBet;

export const selectPlayerHasAction = (state: RootState): boolean =>
  state.gameData.playerHasAction;

export const selectRoundPayouts = (
  state: RootState
): Record<number, number> | null => state.gameData.roundPayouts;

export const selectWaitingForRoundEndContinue = (state: RootState): boolean =>
  state.gameData.waitingForRoundEndContinue;

export default gameDataSlice.reducer;
