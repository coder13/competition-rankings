import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type MeState = {
  foo: string;
};

const initialState: MeState = {
  foo: 'bar',
};

export const tmpSlice = createSlice({
  name: 'tmp',
  initialState,
  reducers: {
    setFoo: (state: MeState, action: PayloadAction<string>) => {
      state.foo = action.payload;
    },
  },
});

export const { setFoo } = tmpSlice.actions;

export default tmpSlice.reducer;
