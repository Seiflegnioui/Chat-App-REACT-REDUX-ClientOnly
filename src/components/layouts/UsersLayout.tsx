import { Outlet, Link } from 'react-router-dom'

export default function UsersLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center border-b border-gray-200">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          ChatApp
        </h1>
        <nav className="flex items-center space-x-6">
          <Link
            to="/user/home"
            className="relative text-gray-600 hover:text-blue-600 transition-all duration-300 group"
          >
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            to="/user/profile"
            className="relative text-gray-600 hover:text-blue-600 transition-all duration-300 group"
          >
            Profile
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-medium shadow hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
            Logout
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}