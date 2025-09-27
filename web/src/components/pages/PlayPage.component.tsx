import { useNavigate } from "react-router-dom";
import { OpponentsContainer } from "../OpponentsContainer.component";
import { GreenFelt } from "../GreenFelt.component";
import { styled } from "styled-components";
import { PlayerBox } from "../PlayerBox.component";
import { PlayerContainer } from "../PlayerContainer.component";

const PlayPage = () => {
  const navigate = useNavigate();

  return (
    <PlayPageContainer>
      <OpponentsContainer />
      <GreenFelt />
      <PlayerContainer />
    </PlayPageContainer>
  );
};

const PlayPageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-items: center;
  align-self: center;
  flex-grow: 1;
  flex-direction: column;
`;

export default PlayPage;
