import { IconButton, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  selectNumberOfPlayers,
  selectPlayerName,
  setNumberOfPlayers,
  setPlayerName,
} from "../../app/setupDataSlice";
import { useAppSelector } from "../../reduxHooks";
import { ArrowDropUp } from "@mui/icons-material";
import { useDispatch } from "react-redux";

const GameSetup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [numberOfPlayers, setNumPlayers] = useState<number>(
    useAppSelector(selectNumberOfPlayers)
  );
  const [playerName, setName] = useState<string>(
    useAppSelector(selectPlayerName)
  );

  const handleGameStart = () => {
    dispatch(setNumberOfPlayers(numberOfPlayers));
    dispatch(setPlayerName(playerName));
  };

  const incrementDecrementButtons = [
    <IconButton key='up'>
      <ArrowDropUp />
    </IconButton>,
  ];

  return (
    <>
      <p> Game Setup </p>
      <GameSetupContainer>
        <SizedRow>
          <p>Number of Players: </p>
          <TextField
            type='number'
            InputProps={{ inputProps: { max: 6, min: 2 } }}
            value={numberOfPlayers}
            onChange={(e) => setNumPlayers(parseInt(e.target.value))}
          />
        </SizedRow>
        <SizedRow>
          <p>Player Name: </p>
          <TextField
            type='string'
            value={playerName}
            onChange={(e) => setName(e.target.value)}
          />
        </SizedRow>
      </GameSetupContainer>
      <button onClick={() => navigate("../")}>Return</button>
      <button onClick={() => handleGameStart()}>Play</button>
    </>
  );
};

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

export default GameSetup;
