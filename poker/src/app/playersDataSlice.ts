import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { emptyPlayer, Player } from "../models/player.model";
import { SetupDataState } from "./setupDataSlice";
import { RootState } from "./store";
import { Card } from "../models/card.model";
import { BlindType } from "../enums/BlindType";

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
    // toggles folded flag and removes cards
    playerFolded(state: PlayersDataState, action: PayloadAction<number>) {
      let foldedPlayerIndex = state.players.findIndex(
        (p) => p.id === action.payload
      );
      let playersArray = [...state.players];
      state.players = [
        ...playersArray.slice(0, foldedPlayerIndex),
        { ...playersArray[foldedPlayerIndex], folded: true, cards: [] },
        ...playersArray.slice(foldedPlayerIndex + 1),
      ];
    },
    // sets all players besides raiser to passed priority is false, DOES NOT EFFECT NUMBERS
    playerRaised(state: PlayersDataState, action: PayloadAction<number>) {
      let raisedPlayerIndex = state.players.findIndex(
        (p) => p.id === action.payload
      );
      let playersArray = [...state.players];
      let alteredPlayers = state.players.map((p) => {
        return { ...p, priorityPassed: false };
      });
      state.players = [
        ...alteredPlayers.slice(0, raisedPlayerIndex),
        { ...playersArray[raisedPlayerIndex] },
        ...alteredPlayers.slice(raisedPlayerIndex + 1),
      ];
    },
    // flips all priority passed to false on new round
    newRoundPrioritySet(state: PlayersDataState, action: PayloadAction) {
      let playersArray = [...state.players];
      let alteredPlayers = state.players.map((p) => {
        return { ...p, priorityPassed: false };
      });
      state.players = [...alteredPlayers];
    },
    // adds bet amount, subtracts difference from stack size, and passes priority
    playerBetAmount(
      state: PlayersDataState,
      action: PayloadAction<{
        id: number;
        betAmount: number;
      }>
    ) {
      let bettingPlayerPlayerIndex = state.players.findIndex(
        (p) => p.id === action.payload.id
      );
      let playersArray = [...state.players];
      const previousBet = playersArray[bettingPlayerPlayerIndex].betValue;
      state.players = [
        ...playersArray.slice(0, bettingPlayerPlayerIndex),
        {
          ...playersArray[bettingPlayerPlayerIndex],
          betValue: action.payload.betAmount,
          stackSize:
            playersArray[bettingPlayerPlayerIndex].stackSize -
            (action.payload.betAmount - previousBet),
          priorityPassed: true,
        },
        ...playersArray.slice(bettingPlayerPlayerIndex + 1),
      ];
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

export const {
  createPlayer,
  updatePlayer,
  removePlayer,
  playerFolded,
  playerRaised,
  newRoundPrioritySet,
  playerBetAmount,
  bulkUpdatePlayers,
} = playersDataSlice.actions;

export const selectPlayerById = (state: RootState, id: number): Player =>
  state.playerData.players.find((p) => p.id === id) ?? emptyPlayer;

export const selectAllPlayers = (state: RootState): Player[] =>
  state.playerData.players;

export const selectOpponents = (state: RootState): Player[] =>
  state.playerData.players.filter((f) => f.id !== 0);

export const selectLittleBlindIndex = (state: RootState): number =>
  state.playerData.players.findIndex(
    (p) => p.blindType === BlindType.SmallBlind
  );

export const selectStartingPlayerIndexOnNewRound = (
  state: RootState
): number => {
  const bbIndex = state.playerData.players.findIndex(
    (p) => p.blindType === BlindType.BigBlind
  );
  const nextPlayerShouldWrap = bbIndex + 1 >= state.playerData.players.length;
  const nextPlayerIndex = nextPlayerShouldWrap ? 0 : bbIndex + 1;
  return nextPlayerIndex;
};

// if all players but one are folded or all in returns false
export const selectDoesPlayContinue = (state: RootState): boolean => {
  const playersAllInOrFolded = state.playerData.players.map((p) => {
    return p.folded || p.stackSize === 0;
  });
  const activePlayers = playersAllInOrFolded.filter((p) => p === false);
  return activePlayers.length > 1;
};

export default playersDataSlice.reducer;
