
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface SetupDataState {
    numberOfPlayers: number,
    playerName: string,
}

const initialState: SetupDataState = {
    numberOfPlayers: 1,
    playerName: ""
}

export const setupDataSlice = createSlice({
    name: 'setupData',
    initialState: initialState,
    reducers: {
        setNumberOfPlayers(state: SetupDataState, action: PayloadAction<number>) {
            state.numberOfPlayers = action.payload
        },
        setPlayerName(state: SetupDataState, action: PayloadAction<string>) {

        },
    },
});

export const { setNumberOfPlayers, setPlayerName } = setupDataSlice.actions;

export const selectNumberOfPlayers = (state: RootState): number => state.setupData.numberOfPlayers;
export const selectPlayerName = (state: RootState): string => state.setupData.playerName;

export default setupDataSlice.reducer;