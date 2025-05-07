import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ISBNState {
  scannedISBN: string | null;
}

const initialState: ISBNState = {
  scannedISBN: null,
};

const isbnSlice = createSlice({
  name: 'isbn',
  initialState,
  reducers: {
    setScannedISBN(state, action: PayloadAction<string>) {
      state.scannedISBN = action.payload;
    },
  },
});

export const { setScannedISBN } = isbnSlice.actions;
export default isbnSlice.reducer;
