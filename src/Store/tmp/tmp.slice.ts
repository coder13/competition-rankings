import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../types";

export type MeState = {
    foo:string,
}

const initialState:MeState = {
    foo:"bar"
}

export const tmpSlice = createSlice({
    "name": "tmp",
    initialState,
    reducers: {
        setFoo: (state, action: PayloadAction<string>) => {
            state.foo = action.payload
        }
    }
});

export const getFoo = (state:RootState) => state.tmp.foo;

export const { setFoo } = tmpSlice.actions;

export default tmpSlice.reducer;