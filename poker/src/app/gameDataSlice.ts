import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Player } from "../models/player.model";
import { SetupDataState } from "./setupDataSlice";
import { RootState } from "./store";
import { Card } from "../models/card.model";
import { GameState } from "../enums/GameState";

export interface GameDataState {
  cardsOnFelt: Card[];
  gameState: GameState;
}

const initialState: GameDataState = {
  cardsOnFelt: [],
  gameState: GameState.PreFlop,
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
  },
});

export const { setCardsOnFelt, updateGameState } = gameDataSlice.actions;

export const selectCardsOnFelt = (state: RootState): Card[] =>
  state.gameData.cardsOnFelt;

export const selectGameState = (state: RootState): GameState =>
  state.gameData.gameState;

export default gameDataSlice.reducer;
