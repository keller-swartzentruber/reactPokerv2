import { createContext, ReactNode, useContext, useMemo } from "react";

type PlayerContextType = {
  playerId: number;
};

export const PlayerContext = createContext<PlayerContextType | null>(null);
export type Props = { children: ReactNode; playerId: number };

export const PlayerContextProvider = ({ children, playerId }: Props) => {
  const value = useMemo(() => ({ playerId }), [playerId]);
  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
};

export const usePlayerContext = () => {
  return useContext(PlayerContext);
};
