import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../store"
import { index } from "../../features/UserThinks"
import axiosClient from "../../axiosClient";
import { useNavigate } from "react-router-dom";
import { get_time_diff } from "./feature";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const ax = axiosClient()
  const navigate = useNavigate()

  const { users, loading, error } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(index());
  }, [dispatch]);

  return (
  <div className="p-6 max-w-md mx-auto">
    <h2 className="text-2xl font-bold mb-6">Users</h2>

    {loading && <p className="text-blue-500">Loading...</p>}
    {error && <p className="text-red-500">Error: {error}</p>}

    <ul className="space-y-3">
      {users.map((user) => (
        <li
          key={user.id}
          className="flex items-center p-3 bg-white shadow-md rounded-xl cursor-pointer hover:bg-gray-100 transition"
          onClick={async () => {
            try {
              const { data } = await ax.post("/conversation/start", {
                ReceiverId: user.id,
                last_join: new Date().toISOString(),
              });
              navigate(`/user/chat/${data}`);
            } catch (error) {
              console.error("Conversation creation failed", error);
            }
          }}
        >
          {/* Avatar */}
         <img
  src={`http://localhost:5228/uploads/${user.photo}`}
  alt={user.username}
  className="w-12 h-12 rounded-full object-cover mr-4"
/>


          {/* User Info */}
          <div className="flex-1">
            <p className="font-semibold text-gray-800">{user.username}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          {/* Last Seen */}
          <div className="text-right text-xs text-gray-400">
 {get_time_diff(user.last_seen)}
</div>

        </li>
      ))}
    </ul>
  </div>
);

}
