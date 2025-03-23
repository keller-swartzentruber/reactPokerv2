import { setCardsOnFelt } from "../app/gameDataSlice";
import { bulkUpdatePlayers, selectAllPlayers } from "../app/playersDataSlice";
import { selectSmallBlindSize } from "../app/setupDataSlice";
import { AppDispatch, AppGetState } from "../app/store";
import { BlindType } from "../enums/BlindType";
import { GameState } from "../enums/GameState";
import { Player } from "../models/player.model";
import { deal, getNewBlinds } from "../utils/pokerUtils";

export const handleNewRound = () => {
  return async (dispatch: AppDispatch, getState: AppGetState) => {
    dispatch(dealAllCards());
    dispatch(cycleBlinds());
  };
};

export const dealAllCards = () => {
  return async (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    const newDeck = deal();
    const players = selectAllPlayers(state);
    let newPlayers: Player[] = [];
    for (const player of players) {
      newPlayers = [
        ...newPlayers,
        {
          ...player,
          cards: newDeck.splice(0, 2).map((card) => {
            const cardShown = player.id === 0;
            return { ...card, isShown: cardShown };
          }),
        },
      ];
    }
    dispatch(bulkUpdatePlayers(newPlayers));
    dispatch(setCardsOnFelt(newDeck.splice(0, 5)));
  };
};

export const cycleBlinds = () => {
  return async (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    const players = selectAllPlayers(state);
    const littleBlindAmount = selectSmallBlindSize(state);
    const previousDealerId = players.findIndex(
      (p) => p.blindType === BlindType.Dealer
    );
    const newBlinds = getNewBlinds(players.length, previousDealerId);
    let newPlayers: Player[] = [];

    for (const player of players) {
      const newBlind = newBlinds[player.id];
      let blindAmount = 0;
      if (newBlind === BlindType.SmallBlind) blindAmount = littleBlindAmount;
      if (newBlind === BlindType.BigBlind) blindAmount = littleBlindAmount * 2;
      if (
        newBlind === BlindType.SmallBlind ||
        newBlind === BlindType.BigBlind
      ) {
        if (player.stackSize < blindAmount) {
          newPlayers = [
            ...newPlayers,
            {
              ...player,
              betValue: player.stackSize,
              stackSize: 0,
              blindType: newBlinds[player.id],
            },
          ];
        } else {
          newPlayers = [
            ...newPlayers,
            {
              ...player,
              betValue: blindAmount,
              stackSize: player.stackSize - blindAmount,
              blindType: newBlinds[player.id],
            },
          ];
        }
      } else {
        newPlayers = [
          ...newPlayers,
          {
            ...player,
            blindType: newBlinds[player.id],
          },
        ];
      }
    }
    dispatch(bulkUpdatePlayers(newPlayers));
  };
};
