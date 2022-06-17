import { configureStore,  } from '@reduxjs/toolkit';
import tmpReducer from "../tmp/tmp.slice";

export const store = configureStore({
    reducer: {
        tmp: tmpReducer,
    }
});

