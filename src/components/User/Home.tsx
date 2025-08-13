import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../store"
import { index } from "../../features/UserThinks"
import axiosClient from "../../axiosClient";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const ax = axiosClient()
  const navigate = useNavigate()

  const { users, loading, error } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(index());
  }, [dispatch]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Users List</h2>

      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

     <ul className="space-y-2">
  {users.map((user) => (
    <li
      key={user.id}
      className="bg-white shadow p-4 rounded-lg"
      onClick={async () => {
        try {
          const {data} = await ax.post("/conversation/start", {
            ReceiverId: user.id,
            last_join: new Date().toISOString(), // ✅ fixed: use ISO format
          });
          navigate(`/user/chat/${data}`)
        } catch (error) {
          console.error("Conversation creation failed", error);
        }
      }}
    >
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
    </li>
  ))}
</ul>

    </div>
  )
}
