import { styled } from "styled-components";
import { BlindType } from "../enums/BlindType";
import { Player } from "../models/player.model";
import CardImages from "../cardImages";
import { BlindChip } from "./BlindChip.component";

export type Props = {
  player: Player;
};

export function PlayerBox({ player }: Props) {
  return (
    <PlayerDiv>
      <BlindChip blind={player.blindType} />
      <StyledLabel>Current Bet: ${player.betValue}</StyledLabel>
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
      <StyledLabel>{player.name}</StyledLabel>
      <StyledLabel>Stack Size: ${player.stackSize}</StyledLabel>
    </PlayerDiv>
  );
}

const PlayerDiv = styled.div`
  margin: 1rem;
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
