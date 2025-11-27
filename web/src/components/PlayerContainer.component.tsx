import { styled } from "styled-components";
import { PlayerBox } from "./PlayerBox.component";
import { useAppSelector } from "../reduxHooks";
import { selectPlayerById } from "../app/playersDataSlice";
import { selectRoundPayouts } from "../app/gameDataSlice";
import { emptyPlayer } from "../models/player.model";
import { PlayerInputs } from "./PlayerInputs.component";

export function PlayerContainer() {
  const player =
    useAppSelector((state) => selectPlayerById(state, 0)) ?? emptyPlayer;
  const roundPayouts = useAppSelector(selectRoundPayouts);

  return (
    <StyledDiv>
      <PlayerBox player={player} payout={roundPayouts?.[0]} />
      <PlayerInputs />
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;
