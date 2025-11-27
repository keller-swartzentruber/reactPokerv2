import styled from "styled-components";
import { useAppSelector } from "../reduxHooks";
import { selectOpponents } from "../app/playersDataSlice";
import { selectRoundPayouts } from "../app/gameDataSlice";
import { OpponentBox } from "./OpponentBox.component";

export const OpponentsContainer = () => {
  const Opponents = useAppSelector((state) => selectOpponents(state));
  const roundPayouts = useAppSelector(selectRoundPayouts);
  return (
    <StyledDiv>
      {Opponents.map((opponent) => (
        <div key={opponent.id}>
          <OpponentBox
            player={opponent}
            payout={roundPayouts?.[opponent.id]}
          />
        </div>
      ))}
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  margin: 1rem;
  display: flex;
  align-items: center;
`;
