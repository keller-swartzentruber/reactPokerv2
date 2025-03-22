import { useNavigate } from "react-router-dom";
import { OpponentsContainer } from "../OpponentsContainer.component";
import { GreenFelt } from "../GreenFelt.component";

const PlayPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <OpponentsContainer />
      <GreenFelt />
      <p>test</p>
    </>
  );
};

export default PlayPage;
