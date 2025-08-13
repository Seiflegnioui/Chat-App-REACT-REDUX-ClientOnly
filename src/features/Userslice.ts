import {  createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { index, login, register } from "./UserThinks";



export interface GuestUser  {
    email:string,
    photo:File,
    username:string,
    password: string,
    last_seen: string,
}

export type User = {
    id: number,
    email: string,
    username: string,
    photo: string,
    last_seen: string,
    role: number
}




let initialState : {users : User[], error: string , loading : boolean , token : string} = {
    users: [],
    error: "",
    token: "",
    loading: false 
}

const UserSlice = createSlice({
    name:"user",
    initialState,
    reducers:{},
    extraReducers(builder) {

        builder.addCase(register.pending, (state) => {
            state.loading = true,
            state.error = ""
            console.log("pending ....");
            
        }),
        builder.addCase(register.fulfilled , (state) => {
            state.loading = false,
            console.log("fullfill ....");

        }),
    

        builder.addCase(login.pending, (state)=>{
            state.loading = true
        }),
        builder.addCase(login.fulfilled, (state,action)=>{
            console.log(action.payload);
            state.token= action.payload
            state.loading = false
        }),
        builder.addCase(login.rejected, (state,action)=>{
            console.log(action.payload);
            state.loading = false
        }),
        builder.addCase(index.pending, (state)=>{
            console.log("pending...");
            state.loading = true
        }),
        builder.addCase(index.fulfilled, (state,action)=>{
            console.log("fulfill...");
            state.users = action.payload
            console.log(state.users);
            
            state.loading = false
        }),
        builder.addCase(index.rejected, (state)=>{
            console.log("pending...");
            state.loading = false
        })
    }
});

export default UserSlice.reducer;

// graph TD
// A[Component] -->|dispatch(index())| B[Redux Middleware]
// B --> C[Dispatch users/index/pending]
// B --> D[Run Axios call]
// D -->|Success| E[Dispatch users/index/fulfilled]
// D -->|Fail| F[Dispatch users/index/rejected]

