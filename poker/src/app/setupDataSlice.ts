import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface SetupDataState {
  numberOfPlayers: number;
  playerName: string;
  initialStackSize: number;
  smallBlindSize: number;
}

const initialState: SetupDataState = {
  numberOfPlayers: 6,
  playerName: "Name",
  initialStackSize: 1000,
  smallBlindSize: 20,
};

export const setupDataSlice = createSlice({
  name: "setupData",
  initialState: initialState,
  reducers: {
    setNumberOfPlayers(state: SetupDataState, action: PayloadAction<number>) {
      state.numberOfPlayers = action.payload;
    },
    setPlayerName(state: SetupDataState, action: PayloadAction<string>) {
      state.playerName = action.payload;
    },
    setInitialStackSize(state: SetupDataState, action: PayloadAction<number>) {
      state.initialStackSize = action.payload;
    },
    setSmallBlindSize(state: SetupDataState, action: PayloadAction<number>) {
      state.smallBlindSize = action.payload;
    },
  },
});

export const {
  setNumberOfPlayers,
  setPlayerName,
  setInitialStackSize,
  setSmallBlindSize,
} = setupDataSlice.actions;

export const selectNumberOfPlayers = (state: RootState): number =>
  state.setupData.numberOfPlayers;
export const selectPlayerName = (state: RootState): string =>
  state.setupData.playerName;
export const selectInitialStackSize = (state: RootState): number =>
  state.setupData.initialStackSize;
export const selectSmallBlindSize = (state: RootState): number =>
  state.setupData.smallBlindSize;

export default setupDataSlice.reducer;
