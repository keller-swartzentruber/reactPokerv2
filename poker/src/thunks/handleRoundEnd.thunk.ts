import { AppDispatch, AppGetState } from "../app/store";

// after all round of action have passed, calculate winner and handle upkeep
export const handleRoundEnd = () => {
  return (dispatch: AppDispatch, getState: AppGetState) => {
    // find winning hand(s)
    // find over the top players
    // payout winner(s)
    // bust players
    // Inform player of state change, add a 'got it' button
  };
};
