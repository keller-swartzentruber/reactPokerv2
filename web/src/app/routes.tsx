import React from "react";
import PlayPage from "../components/pages/PlayPage.component";

const MainMenu = React.lazy(
  () => import("../components/pages/mainMenu.component")
);
const GameSetup = React.lazy(
  () => import("../components/pages/gameSetup.component")
);

const AppRoutes = (): readonly ApplicationRoute[] => [
  {
    path: "/",
    name: "main-menu",
    element: <MainMenu />,
  },
  {
    path: "/setup",
    name: "game-setup",
    element: <GameSetup />,
  },
  {
    path: "/play",
    name: "in-game",
    element: <PlayPage />,
  },
];

interface ApplicationRoute {
  path: string;
  name: string;
  element: React.ReactNode;
}

const defaultComponent = (
  <div>
    <p> Place = held </p>
  </div>
);

export default AppRoutes;
