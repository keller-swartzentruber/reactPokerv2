import styled from "styled-components";
import { useAppSelector } from "../reduxHooks";
import { selectCardsOnFelt, selectGameState } from "../app/gameDataSlice";
import CardImages from "../cardImages";
import { GameState } from "../enums/GameState";

export const GreenFelt = () => {
  const currentCards = useAppSelector((state) => selectCardsOnFelt(state));
  const gameState = useAppSelector((state) => selectGameState(state));
  const shownCards = [];

  return (
    <StyledDiv>
      {currentCards.map((cc) => (
        <CardImage
          key={cc.photoMap}
          src={
            cc.isShown
              ? CardImages[cc.photoMap as keyof typeof CardImages]
              : CardImages["Hidden"]
          }
        />
      ))}
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  flex-wrap: no-wrap;
  align-items: center;
  background: green;
  margin: 2rem;
  display: flex;
  max-width: 50%;
`;

const CardImage = styled.img`
  flex-shrink: 1;
  height: 15rem;
  width: 10rem;
`;

//  height: 10rem;
//  width: 7rem;
