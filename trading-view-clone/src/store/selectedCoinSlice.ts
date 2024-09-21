import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SelectedCoinState {
  coinId: string | null;
}

const initialState: SelectedCoinState = {
  coinId: null,
};

const selectedCoinSlice = createSlice({
  name: 'selectedCoin',
  initialState,
  reducers: {
    setCoinId: (state, action: PayloadAction<string | null>) => {
      state.coinId = action.payload;
    },
  },
});

export const { setCoinId } = selectedCoinSlice.actions;
export default selectedCoinSlice.reducer;