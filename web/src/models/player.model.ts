import { BlindType } from "../enums/BlindType";
import { Card } from "./card.model";

export type Player = {
  id: number;
  name: string;
  stackSize: number;
  blindType: BlindType;
  betValue: number;
  folded: boolean;
  cards: Card[];
  priorityPassed: boolean;
  activePlayer: boolean;
};

export const emptyPlayer: Player = {
  id: -1,
  name: "",
  stackSize: 0,
  blindType: BlindType.NoBlind,
  betValue: 0,
  folded: false,
  cards: [],
  priorityPassed: false,
  activePlayer: false,
};
