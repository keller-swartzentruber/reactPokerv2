import { Card } from "../models/card.model";
import { HandStrength } from "../models/handStrength.model";
import { Player } from "../models/player.model";
import { getHandValue } from "./pokerUtils";

export type PlayerHandValue = { playerId: number; handStrength: HandStrength };

const compareHandStrengths = (a: HandStrength, b: HandStrength): number => {
  if (a.handType !== b.handType) {
    return a.handType - b.handType;
  }
  const maxLength = Math.max(a.kickers.length, b.kickers.length);
  for (let i = 0; i < maxLength; i++) {
    const kickerA = a.kickers[i] ?? 0;
    const kickerB = b.kickers[i] ?? 0;
    if (kickerA !== kickerB) {
      return kickerA - kickerB;
    }
  }
  return 0;
};

export const calculatePlayersHandValues = (
  players: Player[],
  centerCards: Card[]
): PlayerHandValue[] => {
  return players
    .filter((player) => player.folded !== true)
    .map((player) => ({
      playerId: player.id,
      handStrength: getHandValue([...player.cards, ...centerCards]),
    }));
};

export const calculatePayoutsFromBets = (
  players: Player[],
  handValues: PlayerHandValue[]
): Record<number, number> => {
  // Only non-folded players can win, but all players contribute to pots
  const activePlayers = players.filter((p) => !p.folded);

  if (activePlayers.length === 0) {
    return {};
  }

  // Get unique bet sizes from ALL players (including folded) and sort them
  const uniqueBetSizes = [...new Set(players.map((p) => p.betValue))].sort(
    (a, b) => a - b
  );

  const pots: { playersInPot: number[]; potValue: number }[] = [];
  let previousBetLevel = 0;

  // Create pots for each bet level
  for (const betLevel of uniqueBetSizes) {
    // ALL players (folded or not) who bet at least this amount contribute to the pot
    const contributingPlayers = players.filter((p) => p.betValue >= betLevel);

    if (contributingPlayers.length === 0) {
      continue;
    }

    // Calculate pot size: each contributing player contributes (betLevel - previousBetLevel)
    const contributionPerPlayer = betLevel - previousBetLevel;
    const potValue = contributionPerPlayer * contributingPlayers.length;

    // Only active (non-folded) players who contributed can win this pot
    const eligibleWinners = activePlayers.filter((p) => p.betValue >= betLevel);

    pots.push({
      playersInPot: eligibleWinners.map((p) => p.id),
      potValue,
    });

    previousBetLevel = betLevel;
  }

  const payouts: Record<number, number> = {};

  for (const pot of pots) {
    // Get hands of players who are eligible for this pot and didn't fold
    const eligibleHands = handValues.filter((hand) =>
      pot.playersInPot.includes(hand.playerId)
    );

    if (eligibleHands.length === 0) {
      continue;
    }

    const strongestHand = eligibleHands.reduce((best, current) =>
      compareHandStrengths(current.handStrength, best.handStrength) > 0
        ? current
        : best
    );

    const winners = eligibleHands.filter(
      (hand) =>
        compareHandStrengths(hand.handStrength, strongestHand.handStrength) ===
        0
    );

    // Split pot equally among winners
    const payoutPerWinner = Math.floor(pot.potValue / winners.length);
    const remainder = pot.potValue % winners.length;

    // Distribute pot to winners
    winners.forEach((winner, index) => {
      // Give remainder to first winner(s) if there's leftover
      const payout = payoutPerWinner + (index < remainder ? 1 : 0);
      payouts[winner.playerId] = (payouts[winner.playerId] ?? 0) + payout;
    });
  }

  return payouts;
};
