import { setCardsOnFelt } from "../app/gameDataSlice";
import { bulkUpdatePlayers, selectAllPlayers } from "../app/playersDataSlice";
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

export const cycleBlinds = () => {
  return async (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    const players = selectAllPlayers(state);
    const previousDealerId = players.findIndex(
      (p) => p.blindType === BlindType.Dealer
    );
    const newBlinds = getNewBlinds(players.length, previousDealerId);
    const newPlayers: Player[] = [];
    for (const player of players) {
      newPlayers.push({
        ...player,
        blindType: newBlinds[player.id],
      });
    }
    dispatch(bulkUpdatePlayers(newPlayers));
  };
};

export const dealAllCards = () => {
  return async (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    const newDeck = deal();
    const players = selectAllPlayers(state);
    const newPlayers: Player[] = [];
    for (const player of players) {
      newPlayers.push({
        ...player,
        cards: newDeck.splice(0, 2).map((card) => {
          const cardShown = player.id === 0;
          return { ...card, isShown: cardShown };
        }),
      });
    }
    dispatch(bulkUpdatePlayers(newPlayers));
    dispatch(setCardsOnFelt(newDeck.splice(0, 5)));
  };
};
