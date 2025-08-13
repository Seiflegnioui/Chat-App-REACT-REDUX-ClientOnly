import { useState } from "react"
import {  type GuestUser } from "../../features/Userslice"
import { useDispatch } from "react-redux"
import { register } from "../../features/UserThinks"
import type { AppDispatch } from "../../store"

export default function Register() {

const dispatch = useDispatch<AppDispatch>()

    const [guest, setGuest] = useState<GuestUser>({email:"",password:""})
  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Create Account</h2>
      
      <form className="space-y-4" onSubmit={(e)=> {
        e.preventDefault();
        dispatch(register(guest));
        } }>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            onChange={(e) => setGuest((prv:GuestUser) => ({ ...prv, email: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            onChange={(e) => setGuest((prv:GuestUser) => ({ ...prv, password: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  )
}
