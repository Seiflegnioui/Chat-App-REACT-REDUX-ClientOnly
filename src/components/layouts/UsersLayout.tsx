import { Outlet, Link } from 'react-router-dom'

export default function UsersLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Dashboard</h1>
        <nav className="space-x-4">
          <Link
            to="/user/home"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            Home
          </Link>
          <Link
            to="/user/profile"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            Profile
          </Link>
          <button className="text-red-500 hover:text-red-700 transition">
            Logout
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6">
        <Outlet />
      </main>
    </div>
  )
}
