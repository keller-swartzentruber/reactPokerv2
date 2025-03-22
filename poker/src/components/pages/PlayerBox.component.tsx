import { BlindType } from "../../enums/BlindType";

export type Props = {
  cardsShown: boolean;
  stackSize: number;
  blindType: BlindType;
  betValue: number;
  folded: boolean;
};

export function OpponentBox({}: Props) {
  return <></>;
}
