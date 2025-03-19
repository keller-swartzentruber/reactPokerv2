import { useNavigate } from "react-router-dom"



const MainMenu = () => {
    const navigate = useNavigate();


    return <>
        <p> a Pragmatic Poker Page for Perusing Players </p>
        <button onClick={() => navigate('/setup')}>Begin Setup</button>
    </>

}

export default MainMenu;