import { selectGameState } from "../app/gameDataSlice";
import { useAppDispatch, useAppSelector } from "../reduxHooks";
import { advanceGameState } from "../thunks/advanceGameState.thunk";

export function PlayerInputs() {
  const dispatch = useAppDispatch();
  const currentGameState = useAppSelector(selectGameState);
  const incrementGameState = () => {
    dispatch<any>(advanceGameState());
  };
  return (
    <>
      <div>{currentGameState}</div>
      <button onClick={incrementGameState}>ADVANCE GAME STATE</button>
    </>
  );
}
