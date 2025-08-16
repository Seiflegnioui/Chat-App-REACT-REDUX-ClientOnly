import { Outlet, Link } from "react-router-dom";
import { useAppContext } from "../../appContext";
import { get_time_diff } from "../User/feature";

export default function UsersLayout() {
  const { currentUser } = useAppContext();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center border-b border-gray-200">
        {/* App Name - Left Side */}
        <div className="flex items-center">
          <Link to="/user/home" className="group">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              <span className="inline-block transition-transform group-hover:scale-105">
                Chat
              </span>
              <span className="inline-block transition-transform group-hover:scale-110">
                Sphere
              </span>
            </h1>
          </Link>
        </div>

        {/* User Info - Right Side */}
        {currentUser && (
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex flex-col items-end">
              <p className="font-medium text-gray-800">{currentUser.username}</p>
              <p className="text-xs text-gray-500">
                {currentUser.status === "online"
                  ? "Online"
                  : get_time_diff(currentUser.last_seen, "Last seen")}
              </p>
            </div>
            
            <div className="relative group">
              <img
                src={`http://localhost:5228/uploads/${currentUser.photo}`}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-blue-100 shadow-sm transition-transform group-hover:scale-110"
              />
              <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                currentUser.status === "online" ? "bg-green-500" : "bg-gray-400"
              }`}></span>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                <Link
                  to="/user/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  My Profile
                </Link>
                <Link
                  to="/user/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  Settings
                </Link>
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow p-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}