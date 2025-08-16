import { Outlet, Link } from 'react-router-dom'

export default function GuestLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            MyApp
          </h2>
        </Link>
        <div className="flex items-center space-x-6">
          <Link
            to="/auth/login"
            className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium px-3 py-1.5 rounded-md hover:bg-blue-50"
          >
            Sign In
          </Link>
          <Link
            to="/auth/register"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-md shadow-sm hover:shadow-md transition-all duration-200 font-medium"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Page content with subtle animation */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md transition-all duration-300 hover:shadow-2xl">
          <Outlet />
        </div>
      </div>

      {/* Optional footer */}
      <footer className="py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} MyApp. All rights reserved.
      </footer>
    </div>
  )
}