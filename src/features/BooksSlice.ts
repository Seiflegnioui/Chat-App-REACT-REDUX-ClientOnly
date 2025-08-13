import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface BookState {
  name: string;
  pages: number;
}

const initialState: BookState[] =[ {
  name: "",
  pages: 0,
}];

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setBook: (state, action: PayloadAction<BookState>) => {
      state.push(action.payload)
    },
  },
});

export const {setBook} = booksSlice.actions
export default booksSlice.reducer;

