import { useEffect, useMemo, useState } from "react";
import {  useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { index } from "../../features/UserThinks";
import axiosClient from "../../axiosClient";
import { useNavigate } from "react-router-dom";
import { get_time_diff } from "./feature";
import { useAppContext } from "../../appContext";
import { HttpTransportType, HubConnectionBuilder } from "@microsoft/signalr";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const ax = axiosClient();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const { setConnection } = useAppContext();
  const [UnseenMsgs, setUnseenMsgs] = useState<any[]>([]);

  const { users, loading, error } = useSelector(
    (state: RootState) => state.users
  );

  const connection = useMemo(() => {
    return new HubConnectionBuilder()
      .withUrl("ws://localhost:5228/chat", {
        accessTokenFactory: () => localStorage.getItem("TOKEN") ?? "",
        transport: HttpTransportType.WebSockets,
        skipNegotiation: true,
      })
      .withAutomaticReconnect()
      .build();
  }, []);

  useEffect(() => {
    dispatch(index());

    const startConnection = async () => {
      try {
        await connection.start();
        console.log("done");

        const res = await ax.get("/auth/current");
        await connection.invoke("StartInboxConnection", res.data.id);
        setCurrentUser(res.data);
      } catch (err) {
        console.error("SignalR connection failed: ", err);
        setCurrentUser(null);
      }
    };

    connection.on("InboxReceiveMessage", (msg: any) => {
      console.log(msg,"SENT MESSAGE!");
      setUnseenMsgs((prev) => [...prev, msg]);

    });

    startConnection();
    setConnection(connection);
  }, [dispatch, connection]);

  const get_number_of_unseen = (id: number) => {
    return UnseenMsgs.filter((m: any) => m.senderId === id).length;
  };
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
            <img
              src={`http://localhost:5228/uploads/${user.photo}`}
              alt={user.username}
              className="w-12 h-12 rounded-full object-cover mr-4"
            />

            {/* User Info */}
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{user.username} {user.id}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            <div className="text-right text-xs text-gray-400">
              {get_time_diff(user.last_seen)}
            </div>
            <div className="text-right text-xs text-gray-400">
              {get_number_of_unseen(user.id) > 0 && (
                <div className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {get_number_of_unseen(user.id)}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
