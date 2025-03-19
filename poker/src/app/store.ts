import { Action, combineReducers, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { setupDataSlice } from "./setupDataSlice";

const rootReducer = combineReducers({
    setupDataSlice
});

export const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;