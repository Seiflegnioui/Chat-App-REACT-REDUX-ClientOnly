import { configureStore } from "@reduxjs/toolkit";
import BooksReducer from "./features/BooksSlice"
import UserReducer from "./features/Userslice"

export const store = configureStore({
    reducer:{
        users: UserReducer,
        books: BooksReducer,
    } ,
    middleware:(getDefaultMiddleware)=> getDefaultMiddleware().concat(),
    
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch
export type MyStore = typeof store
