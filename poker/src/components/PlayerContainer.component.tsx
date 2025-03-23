import { styled } from "styled-components";
import { PlayerBox } from "./PlayerBox.component";
import { useAppSelector } from "../reduxHooks";
import { selectPlayerById } from "../app/playersDataSlice";
import { emptyPlayer } from "../models/player.model";
import { PlayerInputs } from "./PlayerInputs.component";

export function PlayerContainer() {
  const player =
    useAppSelector((state) => selectPlayerById(state, 0)) ?? emptyPlayer;

  return (
    <StyledDiv>
      <PlayerBox player={player} />
      <PlayerInputs />
    </StyledDiv>
  );
}

const StyledDiv = styled.div``;
