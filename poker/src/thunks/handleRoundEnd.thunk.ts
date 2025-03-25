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
    const value = calculatePlayersHandValues(players, centerCards);
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
): { id: number; payout: number }[] => {
  let TotalPot = players
    .map((p) => {
      return p.betValue;
    })
    .reduce((sum, a) => sum + a, 0);
  let payouts: { id: number; payout: number }[] = [];
  let handsLeft = [...handValue];

  const strongestHands = Math.max(
    ...handsLeft.map((h) => {
      return h.value;
    })
  );
  const winners = handsLeft
    .filter((h) => h.value === h.value)
    .map((h) => {
      return h.playerId;
    });

  // let remainingPot = TotalPot;
  // let totalWinnerBets = winners
  //   .map((winnerId) => {
  //     return players.find((p) => p.id === winnerId)?.betValue || 0;
  //   })
  //   .reduce((sum, bet) => sum + bet, 0);

  // winners.forEach((winnerId) => {
  //   const winnerBet = players.find((p) => p.id === winnerId)?.betValue || 0;
  //   const winnerPayout = (remainingPot * winnerBet) / totalWinnerBets;
  //   payouts.push({ id: winnerId, payout: winnerPayout });
  //   remainingPot -= winnerPayout;
  // });
  // i cant do math right now

  return [];
};
