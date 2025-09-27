import { TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  selectInitialStackSize,
  selectNumberOfPlayers,
  selectPlayerName,
  setInitialStackSize,
  setNumberOfPlayers,
  setPlayerName,
} from "../../app/setupDataSlice";
import { useAppDispatch, useAppSelector } from "../../reduxHooks";
import { createNewGame } from "../../thunks/createNewGame.thunk";
import { StyledButton } from "../StyledButton";

const GameSetup = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [numberOfPlayers, setNumPlayers] = useState<number>(
    useAppSelector(selectNumberOfPlayers)
  );
  const [playerName, setName] = useState<string>(
    useAppSelector(selectPlayerName)
  );
  const [startingMoney, setStartingMoney] = useState<number>(
    useAppSelector(selectInitialStackSize)
  );

  const handleGameStart = () => {
    dispatch(setNumberOfPlayers(numberOfPlayers));
    dispatch(setPlayerName(playerName));
    dispatch(setInitialStackSize(startingMoney));
    dispatch<any>(createNewGame());
    navigate("/play");
  };

  const interpretNumberOfPlayers = (players: number) => {
    if (players > 6) {
      setNumPlayers(6);
    } else if (players < 2) {
      setNumPlayers(2);
    } else {
      setNumPlayers(players);
    }
  };

  const interpretStartingMoney = (money: number) => {
    if (money < 100) {
      setStartingMoney(100);
    } else {
      setStartingMoney(money);
    }
  };

  return (
    <>
      <PageContainer>
        <Header> Game Setup </Header>
        <GameSetupContainer>
          <SizedRow>
            <PaddedLabel>Number of Players: </PaddedLabel>
            <PlayerInputTextField
              variant='standard'
              type='number'
              value={numberOfPlayers}
              onChange={(e) =>
                interpretNumberOfPlayers(parseInt(e.target.value))
              }
            />
          </SizedRow>
          <SizedRow>
            <PaddedLabel>Starting Money: </PaddedLabel>
            <StyledTextField
              variant='standard'
              type='number'
              value={startingMoney}
              onChange={(e) => interpretStartingMoney(parseInt(e.target.value))}
            />
          </SizedRow>
          <SizedRow>
            <PaddedLabel>Player Name: </PaddedLabel>
            <StyledTextField
              variant='standard'
              type='string'
              value={playerName}
              onChange={(e) => setName(e.target.value)}
            />
          </SizedRow>
        </GameSetupContainer>
        <StyledButton onClick={() => navigate("../")} label='Return' />
        <StyledButton
          onClick={() => handleGameStart()}
          disabled={playerName === ""}
          label='Play'
        />
      </PageContainer>
    </>
  );
};

const PageContainer = styled.div`
  margin: 5rem;
`;

const Header = styled.p`
  font-weight: bold;
`;

const GameSetupContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SizedRow = styled.div`
  justify-content: center;
  align-items: center;
  max-width: 100rem;
  display: flex;
`;

const PaddedLabel = styled.p`
  margin: 0.5rem 0.5rem;
`;

const PlayerInputTextField = styled(TextField)`
  background: #d2bde0;
  width: 2rem;
`;

const StyledTextField = styled(TextField)`
  background: #d2bde0;
`;

export default GameSetup;
