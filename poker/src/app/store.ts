import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import setupDataReducer from "./setupDataSlice";
import playerDataReducer from "./playersDataSlice";
import GameDataReducer from "./gameDataSlice";

export const store = configureStore({
  reducer: {
    setupData: setupDataReducer,
    playerData: playerDataReducer,
    gameData: GameDataReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
export type AppGetState = () => RootState;

export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
