import { styled } from "styled-components";
import { BlindType } from "../enums/BlindType";

type Props = {
  blind: BlindType;
};

export function BlindChip({ blind }: Props) {
  let blindText = "";
  let chipColor = "";
  switch (blind) {
    case BlindType.Dealer:
      blindText = "Dealer";
      chipColor = "white";
      break;
    case BlindType.SmallBlind:
      blindText = "Small Blind";
      chipColor = "yellow";
      break;
    case BlindType.BigBlind:
      blindText = "Big Blind";
      chipColor = "orange";
      break;
  }
  return (
    <>
      {blind !== BlindType.NoBlind && (
        <StyledBlindChip color={chipColor}>{blindText}</StyledBlindChip>
      )}
    </>
  );
}

type ChipProps = {
  color: string;
};

const StyledBlindChip = styled.div<ChipProps>`
  display: flex;
  justify-content: center;
  align-self: center;
  align-content: center;
  flex-wrap: wrap;
  width: 5rem;
  height: 5rem;
  background-color: ${({ color }) => color};
  border-radius: 50%;
`;
