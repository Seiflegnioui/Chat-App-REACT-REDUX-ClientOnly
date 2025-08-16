import { useState, type FormEvent } from "react"
import { type GuestUser } from "../../features/Userslice"
import { useDispatch } from "react-redux"
import { register } from "../../features/UserThinks"
import type { AppDispatch } from "../../store"

export default function Register() {
  const dispatch = useDispatch<AppDispatch>()

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
        <p className="text-gray-500">Join our community today</p>
      </div>
      
      <form 
        className="space-y-6" 
        onSubmit={(e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          dispatch(register(e));
        }}
      >
        
        <div className="pt-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Photo
          </label>
          <div className="flex items-center">
            <label className="flex flex-col items-center px-4 py-6 bg-white rounded-lg border border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <span className="mt-2 text-sm text-gray-500">Upload a photo</span>
              <input 
                type="file" 
                name="photo" 
                id="photo" 
                className="hidden" 
                accept="image/*"
              />
            </label>
          </div>
        </div>

        <div className="relative">
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-0 py-3 border-0 border-b border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-0 transition-colors peer"
            placeholder=" "
          />
          <label 
            htmlFor="email" 
            className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-gray-500 peer-focus:text-sm"
          >
            Email address
          </label>
        </div>

        <div className="relative">
          <input
            type="text"
            id="username"
            name="username"
            required
            className="w-full px-0 py-3 border-0 border-b border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-0 transition-colors peer"
            placeholder=" "
          />
          <label 
            htmlFor="username" 
            className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-gray-500 peer-focus:text-sm"
          >
            Username
          </label>
        </div>

        <div className="relative">
          <input
            type="password"
            id="password"
            name="password"
            required
            className="w-full px-0 py-3 border-0 border-b border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-0 transition-colors peer"
            placeholder=" "
          />
          <label 
            htmlFor="password" 
            className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-gray-500 peer-focus:text-sm"
          >
            Password
          </label>
        </div>


        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-md hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create Account
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}