import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  // const [conversations, setConversations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search

  const { users, loading, error } = useSelector(
    (state: RootState) => state.users
  );

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
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
    // fetchConversations();

    const fetchUser = async () => {
      try {
        const res = await ax.get("/auth/current");
        const { data } = await ax.get(`/message/unseen/${res.data.id}`);
        console.log(res);
        console.log(data);
        setUnseenMsgs((prev: any) => [...prev, ...data]);

        setCurrentUser(res.data);
      } catch {
        setCurrentUser(null);
      }
    };
    fetchUser();

    const startConnection = async () => {
      try {
        await connection.start();
        console.log("SignalR Connected");

        const res = await ax.get("/auth/current");
        await connection.invoke("StartInboxConnection", res.data.id);
       
        setCurrentUser(res.data);
      } catch (err) {
        console.error("SignalR connection failed: ", err);
        setCurrentUser(null);
      }
    };

    connection.on("InboxReceiveMessage", (msg: any) => {
      console.log("New message received:", msg);
      setUnseenMsgs((prev) => [...prev, msg]);
      // setConversations((prev) => {
      //   const existingConv = prev.find((c) => c.id === msg.conversationId);
      //   if (existingConv) {
      //     return prev
      //       .map((c) =>
      //         c.id === msg.conversationId
      //           ? {
      //               ...c,
      //               lastMessage: msg,
      //               updatedAt: new Date().toISOString(),
      //             }
      //           : c
      //       )
      //       .sort(
      //         (a, b) =>
      //           new Date(b.updatedAt).getTime() -
      //           new Date(a.updatedAt).getTime()
      //       );
      //   }
      //   return prev;
      // });
    });

    startConnection();
    setConnection(connection);
  }, [dispatch, connection]);

  const get_number_of_unseen = (id: number) => {
    return UnseenMsgs.filter((m: any) => m.senderId === id).length;
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="p-4">
          <h1 className="text-xl font-semibold text-center">Chats</h1>
        </div>

        <div className="px-4 pb-3">
          <div className="relative border-b-2 border-gray-200 focus-within:border-blue-500 transition-colors duration-200">
            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-8 pr-8 py-3 bg-transparent focus:outline-none focus:ring-0"
              placeholder="Search messages"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md mx-4 my-2">
          Error: {error}
        </div>
      )}

      <ul className="divide-y divide-gray-100">
        {filteredUsers
    .slice() // copy so you don’t mutate original array
    .sort((a, b) => {
      const unseenA = get_number_of_unseen(a.id);
      const unseenB = get_number_of_unseen(b.id);

      // sort descending: users with unseen messages come first
      if (unseenB !== unseenA) {
        return unseenB - unseenA;
      }

      // optional: secondary sort by username or last_seen if equal
      return a.username.localeCompare(b.username);
    }).map((user) => {
          const unseenCount = get_number_of_unseen(user.id);
          // const conversation = conversations.find((c) =>
          //   c.participants.some((p: any) => p.id === user.id)
          // );

          return (
            <li
              key={user.id}
              className="flex items-center p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
              onClick={async () => {
                try {
                  const { data } = await ax.post("/conversation/start", {
                    ReceiverId: user.id,
                    last_join: new Date().toISOString(),
                  });
                  setUnseenMsgs((prev) =>
                    prev.filter((m) => m.senderId !== user.id)
                  );
                  navigate(`/user/chat/${data}`);
                } catch (error) {
                  console.error("Conversation creation failed", error);
                }
              }}
            >
              <div className="relative">
                <img
                  src={`http://localhost:5228/uploads/${user.photo}`}
                  alt={user.username}
                  className="w-14 h-14 rounded-full object-cover mr-3 border-2 border-gray-200"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center relative">
                  <p className="font-semibold text-gray-900 truncate">
                    {user.username}
                  </p>

                  <div className="flex items-center ml-2 text-xs text-gray-500 whitespace-nowrap">
                    {get_time_diff(user.last_seen, "online") === "online" ? (
                      <span className="flex items-center space-x-2">
                        {/* Green dot */}
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        <p>online</p>
                      </span>
                    ) : (
                      <span>{get_time_diff(user.last_seen, "online")}</span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-500 truncate">
                  No messages yet
                </p>
              </div>

              {unseenCount > 0 && (
                <div className="ml-3 bg-red-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                  {unseenCount}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
