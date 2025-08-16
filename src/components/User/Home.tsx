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
  const [conversations, setConversations] = useState<any[]>([]);

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
    // fetchConversations();

    const startConnection = async () => {
      try {
        await connection.start();
        console.log("SignalR Connected");

        const res = await ax.get("/auth/current");
        setTimeout(async ()=>{
          await connection.invoke("StartInboxConnection", res.data.id);
        },5000)
        setCurrentUser(res.data);
      } catch (err) {
        console.error("SignalR connection failed: ", err);
        setCurrentUser(null);
      }
    };

    connection.on("InboxReceiveMessage", (msg: any) => {
      console.log("New message received:", msg);
      setUnseenMsgs((prev) => [...prev, msg]);
      // Also update conversations to show latest message
      setConversations(prev => {
        const existingConv = prev.find(c => c.id === msg.conversationId);
        if (existingConv) {
          return prev.map(c => 
            c.id === msg.conversationId 
              ? {...c, lastMessage: msg, updatedAt: new Date().toISOString()} 
              : c
          ).sort((a, b) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        }
        return prev;
      });
    });

    startConnection();
    setConnection(connection);

    // return () => {
    //   connection.off("InboxReceiveMessage");
    // };
  }, [dispatch, connection]);

  // const fetchConversations = async () => {
  //   try {
  //     const { data } = await ax.get("/conversation");
  //     setConversations(data);
  //   } catch (error) {
  //     console.error("Failed to fetch conversations", error);
  //   }
  // };

  const get_number_of_unseen = (id: number) => {
    return UnseenMsgs.filter((m: any) => m.senderId === id).length;
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Instagram-like header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
        <h1 className="text-xl font-semibold text-center">Chats</h1>
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
        {users.map((user) => {
          const unseenCount = get_number_of_unseen(user.id);
          const conversation = conversations.find(c => 
            c.participants.some((p: any) => p.id === user.id)
          );
          
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
                  // Clear unseen messages for this user when opening chat
                  setUnseenMsgs(prev => prev.filter(m => m.senderId !== user.id));
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
                {/* {user.isOnline && (
                  <div className="absolute bottom-0 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )} */}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-gray-900 truncate">
                    {user.username}
                  </p>
                  <p className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                    {get_time_diff(user.last_seen,"online")}
                  </p>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {conversation?.lastMessage?.content || "No messages yet"}
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