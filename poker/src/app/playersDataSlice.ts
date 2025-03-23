import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Player } from "../models/player.model";
import { SetupDataState } from "./setupDataSlice";
import { RootState } from "./store";

export interface PlayersDataState {
  players: Player[];
}

const initialState: PlayersDataState = {
  players: [],
};

export const playersDataSlice = createSlice({
  name: "playersData",
  initialState: initialState,
  reducers: {
    createPlayer(state: PlayersDataState, action: PayloadAction<Player>) {
      state.players = [...state.players, action.payload];
    },
    updatePlayer(state: PlayersDataState, action: PayloadAction<Player>) {
      let filteredPlayers = state.players.filter(
        (p) => p.id !== action.payload.id
      );
      state.players = [...filteredPlayers, action.payload];
    },
    removePlayer(state: PlayersDataState, action: PayloadAction<number>) {
      let filteredPlayers = state.players.filter(
        (p) => p.id !== action.payload
      );
      state.players = [...filteredPlayers];
    },
    bulkUpdatePlayers(
      state: PlayersDataState,
      action: PayloadAction<Player[]>
    ) {
      let filteredPlayers = state.players.filter(
        (p) => !action.payload.some((oldPlayer) => oldPlayer.id === p.id)
      );
      state.players = [...filteredPlayers, ...action.payload];
    },
  },
});

export const { createPlayer, updatePlayer, removePlayer, bulkUpdatePlayers } =
  playersDataSlice.actions;

export const selectPlayerById = (state: RootState, id: number): Player | null =>
  state.playerData.players.find((p) => p.id === id) ?? null;

export const selectAllPlayers = (state: RootState): Player[] =>
  state.playerData.players;

export const selectOpponents = (state: RootState): Player[] =>
  state.playerData.players.filter((f) => f.id !== 0);

export default playersDataSlice.reducer;
