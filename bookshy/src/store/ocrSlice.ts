import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OCRState {
  imageDataUrl: string | null;
  textList: string[];
}

const initialState: OCRState = {
  imageDataUrl: null,
  textList: [],
};

const ocrSlice = createSlice({
  name: 'ocr',
  initialState,
  reducers: {
    setCapturedImage(state, action: PayloadAction<string>) {
      state.imageDataUrl = action.payload;
    },
    setOCRTextList(state, action: PayloadAction<string[]>) {
      state.textList = action.payload;
    },
    resetOCR(state) {
      state.imageDataUrl = null;
      state.textList = [];
    },
  },
});

export const { setCapturedImage, setOCRTextList, resetOCR } = ocrSlice.actions;
export default ocrSlice.reducer;
