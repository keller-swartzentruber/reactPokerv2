import { setCardsOnFelt, updateCurrentBet } from "../app/gameDataSlice";
import { bulkUpdatePlayers, selectAllPlayers } from "../app/playersDataSlice";
import { selectSmallBlindSize } from "../app/setupDataSlice";
import { AppDispatch, AppGetState } from "../app/store";
import { BlindType } from "../enums/BlindType";
import { Player } from "../models/player.model";
import { deal, getNewBlinds } from "../utils/pokerUtils";

// after all action has occured and winner / losers have been decided and payed
export const handleRoundStart = () => {
  return (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    const smallBlindSize = selectSmallBlindSize(state);
    dispatch(dealAllCards());
    dispatch(cycleBlinds());
    // this will need updated (could be smaller stack size)
    dispatch(updateCurrentBet(smallBlindSize * 2));

    // discover player that is up, if not player handleActionPassed
  };
};

// give new cards to players and table
export const dealAllCards = () => {
  return (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    const newDeck = deal();
    const players = selectAllPlayers(state);
    let newPlayers: Player[] = [];
    for (const player of players) {
      newPlayers = [
        ...newPlayers,
        {
          ...player,
          folded: false,
          priorityPassed: false,
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

// cycles blinds and removes blind amount from little and big
export const cycleBlinds = () => {
  return (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    const players = selectAllPlayers(state);
    const littleBlindAmount = selectSmallBlindSize(state);
    const previousLittleBlindId = players.findIndex(
      (p) => p.blindType === BlindType.SmallBlind
    );
    const newBlinds = getNewBlinds(players.length, previousLittleBlindId);
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
