import styled from "styled-components";
import { selectGameState } from "../app/gameDataSlice";
import { useAppDispatch, useAppSelector } from "../reduxHooks";
import { advanceGameState } from "../thunks/advanceGameState.thunk";
import { StyledButton } from "./StyledButton";
import { playerFolded } from "../app/playersDataSlice";
import { handleActionPassed } from "../thunks/handleActionPassed.thunk";

export function PlayerInputs() {
  const dispatch = useAppDispatch();
  const currentGameState = useAppSelector(selectGameState);
  const incrementGameState = () => {
    dispatch<any>(advanceGameState());
  };

  // should available actions be in state

  const handleCall = () => {};

  const handleFold = () => {
    dispatch(playerFolded(0));
    dispatch(handleActionPassed());
  };

  const handleRaise = () => {};

  return (
    <>
      <div>{currentGameState}</div>
      <ButtonContainer>
        <StyledButton onClick={incrementGameState} label='ADVANCE GAME STATE' />
        <StyledButton onClick={handleFold} label='Fold' />
      </ButtonContainer>
      <StyledButton onClick={incrementGameState} label='ADVANCE GAME STATE' />
    </>
  );
}

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
