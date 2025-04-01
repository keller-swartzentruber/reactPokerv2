import { current } from "@reduxjs/toolkit";
import { selectCardsOnFelt } from "../app/gameDataSlice";
import { selectAllPlayers } from "../app/playersDataSlice";
import { AppDispatch, AppGetState } from "../app/store";
import { Card } from "../models/card.model";
import { Player } from "../models/player.model";
import { getHandValue } from "../utils/pokerUtils";

// after all round of action have passed, calculate winner and handle upkeep
export const handleRoundEnd = () => {
  return (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    const players = selectAllPlayers(state);
    const centerCards = selectCardsOnFelt(state);
    const handValues = calculatePlayersHandValues(players, centerCards);
    const payouts = comparePlayersHandsAndStacks(players, handValues);
    // find winning hand(s)
    // find over the top players
    // payout winner(s)
    // bust players
    // Inform player of state change, add a 'got it' button
  };
};

const calculatePlayersHandValues = (
  players: Player[],
  centerCards: Card[]
): { playerId: number; value: number }[] => {
  const handValues: { playerId: number; value: number }[] = [];
  for (const player of players) {
    if (player.folded !== true) {
      handValues.push({
        playerId: player.id,
        value: getHandValue([...player.cards, ...centerCards]),
      });
    }
  }
  return handValues;
};

const comparePlayersHandsAndStacks = (
  players: Player[],
  handValue: { playerId: number; value: number }[]
): Record<number, number> => {
  let localPlayers = [...players];

  // map players to their bet sizes
  let playerBetSizes: Record<number, number[]> = {};
  for (const player of localPlayers) {
    playerBetSizes[player.betValue] = [
      ...(playerBetSizes[player.betValue] ?? []),
      player.id,
    ];
  }
  let sortedBetSizes = Object.keys(playerBetSizes)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .map((s) => {
      return parseInt(s);
    });

  // find all the players in the pots
  let pots: { playersInPot: number[]; potValue: number }[] = [];
  let changingBetSizes = [...sortedBetSizes];
  let lastPotSize = 0;
  for (const betSize of sortedBetSizes) {
    const playersStillinPot = sortedBetSizes
      .map((sb) => {
        return playerBetSizes[sb];
      })
      .flat();
    pots.push({
      playersInPot: playersStillinPot,
      potValue: betSize,
    });
    lastPotSize = betSize;
    // remove value in pot from bet sizes and remove bet size
    sortedBetSizes = sortedBetSizes
      .filter((f) => f !== betSize)
      .map((bs) => {
        return (bs = bs - betSize);
      });
  }

  // find winner(s) in pots, and add to payout
  let payouts: Record<number, number> = {};
  let localPlayersHands = [...handValue];
  for (const currentPot of pots) {
    const currentHands = localPlayersHands.filter((lh) =>
      currentPot.playersInPot.includes(lh.playerId)
    );
    const highestValue = Math.max(
      ...currentHands.map((h) => {
        return h.value;
      })
    );
    const winningHands = currentHands.filter((ch) => ch.value === highestValue);
    for (const winner of winningHands) {
      payouts[winner.playerId] =
        (payouts[winner.playerId] ?? 0) +
        Math.floor(
          (currentPot.potValue * currentHands.length) / winningHands.length
        );
    }
  }

  return payouts;
};
