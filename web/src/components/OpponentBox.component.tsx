import { styled } from "styled-components";
import { BlindType } from "../enums/BlindType";
import { Player } from "../models/player.model";
import CardImages from "../cardImages";
import { BlindChip } from "./BlindChip.component";
import { PayoutDisplay } from "./PayoutDisplay.component";

export type Props = {
  player: Player;
  payout?: number;
};

export function OpponentBox({ player, payout }: Props) {
  return (
    <OpponentDiv>
      <StyledLabel>{player.name}</StyledLabel>
      <StyledLabel>Stack Size: ${player.stackSize}</StyledLabel>
      <CardContainer>
        {!player.folded &&
          player.cards.map((cc) => (
            <CardImage
              key={cc.photoMap}
              src={
                cc.isShown
                  ? CardImages[cc.photoMap as keyof typeof CardImages]
                  : CardImages["Hidden"]
              }
            />
          ))}
      </CardContainer>
      <StyledLabel>Current Bet: ${player.betValue}</StyledLabel>
      <BlindChip blind={player.blindType} />
      {payout !== undefined && <PayoutDisplay payout={payout} />}
    </OpponentDiv>
  );
}

const OpponentDiv = styled.div`
  margin: 1rem 6rem;
  padding: 1rem 0rem 0rem 0rem;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const CardImage = styled.img`
  flex-shrink: 1;
  height: 12rem;
  width: 8rem;
`;

const StyledLabel = styled.div`
  font-size: 20px;
`;
