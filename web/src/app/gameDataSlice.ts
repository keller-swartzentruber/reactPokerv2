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
}

const initialState: GameDataState = {
  cardsOnFelt: [],
  currentBet: 0,
  gameState: GameState.PreFlop,
  playerHasAction: true,
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
  },
});

export const {
  setCardsOnFelt,
  updateGameState,
  updateCurrentBet,
  updatePlayerHasAction,
} = gameDataSlice.actions;

export const selectCardsOnFelt = (state: RootState): Card[] =>
  state.gameData.cardsOnFelt;

export const selectGameState = (state: RootState): GameState =>
  state.gameData.gameState;

export const selectCurrentBet = (state: RootState): number =>
  state.gameData.currentBet;

export const selectPlayerHasAction = (state: RootState): boolean =>
  state.gameData.playerHasAction;

export default gameDataSlice.reducer;
