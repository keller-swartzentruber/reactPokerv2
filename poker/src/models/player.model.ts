import { BlindType } from "../enums/BlindType";
import { Card } from "./card.model";

export type Player = {
  id: number;
  name: string;
  cardsShown: boolean;
  stackSize: number;
  blindType: BlindType;
  betValue: number;
  folded: boolean;
  cards: Card[];
};
