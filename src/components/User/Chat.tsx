import { useEffect, useState, type FormEvent } from "react";
import Home from "./Home";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../appContext";
import axiosClient from "../../axiosClient";
import { get_time_diff } from "./feature";

export default function Chat() {
  const { ID } = useParams<string>();
  const ax = axiosClient();
  const [Messages, setMessages] = useState<any>([]);
  const [content, setContent] = useState<any>();
  // const [User, setUser] = useState<any>();
  const {
    StartConversation,
    LeaveConversation,
    currentUser,
    connection,
    SendMessageSignal,
  } = useAppContext();

  useEffect(() => {
    const handler = (msg: any) => {
      console.log("event received:", msg);
      setMessages((p: any) => [...p, msg]);
    };
    connection.on("ReceiveMessage", handler);
    const getAll = async () => {
      try {
        const { data } = await ax.get(`/message/all/${ID}`);
        setMessages(data);

        console.log(data);
      } catch (error) {}
    };
    getAll();
    StartConversation(ID || "");
    return () => {
      connection.off("ReceiveMessage", handler);
      LeaveConversation(ID || "");
    };
  }, [ID, StartConversation, LeaveConversation]);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = { ConversationId: ID, content };
      console.log(data);

      const msg = await ax.post("/message/send", data);
      // setMessages((p: any) => [...p, msg.data]);
      const conv: string | undefined = ID;
      console.log(conv, msg.data);

      SendMessageSignal(conv, msg.data);

      console.log("message sent");
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <div className="h-screen flex bg-gray-100">
      <aside className="w-1/3 border-r bg-white overflow-y-auto shadow-sm">
        <Home />
      </aside>

      {/* Chat section */}
      <main className="flex-1 flex flex-col">
       {/* Chat header */}
<div className="p-4 border-b bg-white flex items-center justify-between">
  {/* Left: Avatar + User info */}
  <div className="flex items-center space-x-3">
    <img
      src={`http://localhost:5228/uploads/${currentUser.photo}`}
      alt={currentUser.username}
      className="w-10 h-10 rounded-full object-cover"
    />
    <div className="flex flex-col">
      <span className="font-semibold text-gray-800">{currentUser.username}</span>
      <span className="text-xs text-gray-500">
        {get_time_diff(currentUser.last_seen)}
      </span>
    </div>
  </div>

  {/* Right: Actions (optional) */}
  <div className="flex items-center space-x-3">
    {/* Example icons */}
    <button className="text-gray-400 hover:text-gray-600">
      <i className="fas fa-phone"></i>
    </button>
    <button className="text-gray-400 hover:text-gray-600">
      <i className="fas fa-video"></i>
    </button>
    <button className="text-gray-400 hover:text-gray-600">
      <i className="fas fa-ellipsis-v"></i>
    </button>
  </div>
</div>


        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
          {Messages.map((msg: any, idx: number) => {
            const isCurrentUser = msg.senderId === currentUser?.id;
            console.log(
              "msg id: ",
              msg.id,
              " sender id  : ",
              msg.senderId,
              " my id : ",
              currentUser?.id
            );

            return (
              <div
                key={idx}
                className={`flex ${
                  isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`${
                    isCurrentUser ? "bg-blue-500 text-white" : "bg-white"
                  } px-4 py-2 rounded-2xl shadow text-sm max-w-xs`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}

          {/* More messages here */}
        </div>

        {/* Message input */}
        <form
          onSubmit={(e) => sendMessage(e)}
          className="p-4 border-t bg-white flex items-center gap-2"
        >
          <input
            onChange={(e) => setContent(e.target.value)}
            type="text"
            placeholder="Message..."
            className="flex-1 px-4 py-2 border rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
          >
            Send
          </button>
        </form>
      </main>
    </div>
  );
}
