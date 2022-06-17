import { store } from "./cfg/configureStore";

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
