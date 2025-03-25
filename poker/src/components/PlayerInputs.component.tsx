import styled from "styled-components";
import {
  selectCurrentBet,
  selectGameState,
  selectPlayerHasAction,
  updateCurrentBet,
} from "../app/gameDataSlice";
import { useAppDispatch, useAppSelector } from "../reduxHooks";
import { advanceGameState } from "../thunks/advanceGameState.thunk";
import { StyledButton } from "./StyledButton";
import {
  playerBetAmount,
  playerFolded,
  playerRaised,
  selectPlayerById,
} from "../app/playersDataSlice";
import { handleActionPassed } from "../thunks/handleActionPassed.thunk";
import { useState } from "react";
import { Input, TextField } from "@mui/material";

export function PlayerInputs() {
  const dispatch = useAppDispatch();
  const currentGameState = useAppSelector(selectGameState);
  const playerHasAction = useAppSelector(selectPlayerHasAction);
  const tableCurrentBet = useAppSelector(selectCurrentBet);
  const player = useAppSelector((state) => selectPlayerById(state, 0));
  const startingRaiseAmount =
    tableCurrentBet * 1.5 > player.stackSize
      ? player.stackSize
      : tableCurrentBet * 1.5;
  const [raiseAmount, setRaiseAmount] = useState<number>(startingRaiseAmount);

  // should available actions be in state

  const handleCall = () => {
    if (tableCurrentBet !== player.betValue) {
      dispatch(playerBetAmount({ id: 0, betAmount: tableCurrentBet }));
      dispatch(handleActionPassed(0));
    } else {
      dispatch(handleActionPassed(0));
    }
  };

  const handleFold = () => {
    dispatch(playerFolded(0));
    dispatch(handleActionPassed(0));
  };

  const handleRaise = () => {
    dispatch(updateCurrentBet(raiseAmount));
    dispatch(playerRaised(0));
    dispatch(playerBetAmount({ id: 0, betAmount: raiseAmount }));
    dispatch(handleActionPassed(0));
  };

  const handleRaiseAmountChanged = (amount: string) => {
    const amountInt = Number.parseInt(amount);
    const raiseValue = Number.isNaN(amountInt) ? 0 : amountInt;

    if (raiseValue > player.stackSize) {
      setRaiseAmount(player.stackSize);
    } else {
      setRaiseAmount(raiseValue);
    }
  };

  return (
    <>
      {playerHasAction && (
        <>
          <div>{currentGameState}</div>
          <ButtonContainer>
            <StyledButton
              disabled={tableCurrentBet > player.stackSize}
              onClick={handleCall}
              label='Call'
            />
            <StyledButton onClick={handleFold} label='Fold' />
          </ButtonContainer>
          <ButtonContainer>
            <StyledButton
              onClick={handleRaise}
              disabled={raiseAmount <= tableCurrentBet}
              label='Raise to'
            />
            <RaiseInputTextField
              type='string'
              value={raiseAmount}
              onChange={(e) => handleRaiseAmountChanged(e.target.value)}
            />
            <StyledButton onClick={handleFold} label='ALL IN' />
          </ButtonContainer>
        </>
      )}
    </>
  );
}

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
`;

const RaiseInputTextField = styled(Input)`
  background: #d2bde0;
  display: flex;
  flex-grow: 1
  max-width: 6rem;
  height: 3rem;
`;
