import React from "react";
import { useNavigate } from "react-router-dom"
import { selectNumberOfPlayers } from "../../app/setupDataSlice";
import { useAppSelector } from "../../reduxHooks";



const GameSetup = () => {
    const navigate = useNavigate();
    var numberOfPlayers = useAppSelector(selectNumberOfPlayers);



    return <>
        <p> Game Setup </p>
        <input type="number" value={numberOfPlayers} onChange={handleNumberOfPlayersChanged}/>
        <button onClick={() => navigate('../')}>Return</button>
    </>

}

export default GameSetup;

function handleNumberOfPlayersChanged($event: any) {
    throw new Error("Function not implemented.");
}