import { HandType } from "../enums/HandType";

export type HandStrength = {
  handType: HandType;
  kickers: number[];
};
