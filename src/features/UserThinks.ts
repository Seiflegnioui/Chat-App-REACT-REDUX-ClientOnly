import { createAsyncThunk } from "@reduxjs/toolkit"
import axiosClient from "../axiosClient"
import type { GuestUser, User } from "./Userslice"
import {     type NavigateFunction } from "react-router-dom"

const ax = axiosClient()

export const register = createAsyncThunk<void,GuestUser,{rejectValue: string}>("users/register", async(guest: GuestUser , thunk)=>{
    try {
        const res = await ax.post("auth/register", guest)
        return thunk.fulfillWithValue(res.data);
    } catch (error: any) {
        return thunk.rejectWithValue(error.response?.data?.message ?? "Error in register"
)
    }
})
export const index = createAsyncThunk<User[] ,void ,{rejectValue : string} >("users/index", 
    async (_, thunk)=>{
        try {
            const {data} = await ax.get<User[]>("auth/index")
            return thunk.fulfillWithValue(data)
        } catch (error: any) {
            const msg = error.response?.data?.message ?? "Error is here"
            return thunk.rejectWithValue(msg)
        }
    }
)

export const login = createAsyncThunk<string, { guest: GuestUser, navigate: NavigateFunction }, {rejectValue: string}>("users/login",async ({guest,navigate}, thunk)=>{


    try {   
        const { data } = await ax.post("/auth/login", guest)
        localStorage.setItem("TOKEN", data)
        navigate("/user/home")

        return thunk.fulfillWithValue(data)
    } catch (error: any) {
        const msg = error.response?.data?.message ?? "Error is here"
        return thunk.rejectWithValue(msg) 
    }
})

// whatever you return via thunk.fulfillWithValue(value) or thunk.rejectWithValue(value)
//  becomes the payload of the action received in your slice’s extraReducers handlers.
