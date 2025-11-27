import { Player } from "../models/player.model";

export type OpponentAction =
  | { type: "fold" }
  | { type: "call"; amount: number }
  | { type: "raise"; betAmount: number; newCurrentBet: number };

export const decideOpponentAction = (
  player: Player,
  currentBet: number
): OpponentAction => {
  const randomDecision = Math.floor(Math.random() * 100);

  if (randomDecision < 10) {
    return { type: "fold" };
  }

  if (randomDecision < 90 || player.stackSize <= currentBet) {
    const callAmount = Math.min(player.stackSize, currentBet);
    return { type: "call", amount: callAmount };
  }

  const randomRaiseAmount = Math.floor(Math.random() * 3) + 1;
  const proposedBet = randomRaiseAmount * currentBet;
  const raiseValue = Math.min(player.stackSize, proposedBet);

  return {
    type: "raise",
    betAmount: raiseValue,
    newCurrentBet: raiseValue,
  };
};

