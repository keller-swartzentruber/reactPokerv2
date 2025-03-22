import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Player } from "../models/player.model";
import { SetupDataState } from "./setupDataSlice";
import { RootState } from "./store";
import { Card } from "../models/card.model";

export interface GameDataState {
  cardsOnFelt: Card[];
  gameState: number; // switch to enum
}

const initialState: GameDataState = {
  cardsOnFelt: [],
  gameState: 0,
};

export const gameDataSlice = createSlice({
  name: "gameData",
  initialState: initialState,
  reducers: {
    setCardsOnFelt(state: GameDataState, action: PayloadAction<Card[]>) {
      state.cardsOnFelt = action.payload;
    },
    updateGameState(state: GameDataState, action: PayloadAction<number>) {
      state.gameState = action.payload;
    },
  },
});

export const { setCardsOnFelt, updateGameState } = gameDataSlice.actions;

export const selectCardsOnFelt = (state: RootState, id: number): Card[] =>
  state.gameData.cardsOnFelt;

export const selectGameState = (state: RootState): number =>
  state.gameData.gameState;

export default gameDataSlice.reducer;
