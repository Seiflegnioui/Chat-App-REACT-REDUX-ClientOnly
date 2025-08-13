import { Outlet, Link } from 'react-router-dom'

export default function GuestLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-blue-600">MyApp</h2>
        <div className="space-x-4">
          <Link
            to="/auth/login"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            Login
          </Link>
          <Link
            to="/auth/register"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* Page content */}
      <div className="flex items-center justify-center py-10">
        <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">Welcome Guest</h1>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
