import { useEffect, useState, type FormEvent } from "react";
import Home from "./Home";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../appContext";
import axiosClient from "../../axiosClient";
import { get_time_diff } from "./feature";

export default function Chat() {
  const { ID } = useParams<string>();
  const ax = axiosClient();
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [Messages, setMessages] = useState<any>([]);
  const [content, setContent] = useState<any>();

  const {
    StartConversation,
    LeaveConversation,
    connection,
    SendMessageSignal,
    CurrConv,
    setCurrConv,
  } = useAppContext();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await ax.get("/auth/current");
        await StartConversation(ID || "");
        setCurrentUser(res.data);
      } catch {
        setCurrentUser(null);
      }
    };
    fetchUser();

    setCurrConv(Number.parseInt(ID!));

    const handler = async (msg: any) => {
      setMessages((prev: any) => [...prev, msg]);
      console.log(Number.parseInt(ID!));
      console.log(msg.conversationID);

      if (Number.parseInt(ID!) === msg.conversationID) {
        console.log(
          "helloooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo"
        );

        await connection.invoke("OnMarkSeen", ID);
      }
    };

    connection.on("ReceiveMessage", handler);

    const seenHandler = (updatedMessages: any[]) => {
      setMessages((prev: any[]) =>
        prev.map((msg) => {
          const updated = updatedMessages.find((m) => m.id === msg.id);
          return updated ? { ...msg, seen_time: updated.seen_time } : msg;
        })
      );
    };

    connection.on("SeenUpdate", seenHandler);
    const getAll = async () => {
      try {
        const { data } = await ax.get(`/message/all/${ID}`);
        setMessages(data);
      } catch (error) {}
    };
    getAll();

    return () => {
      connection.off("ReceiveMessage", handler);
      setCurrConv(0);
      LeaveConversation(ID || "");
    };
  }, [ID, StartConversation, LeaveConversation]);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = { ConversationId: ID, content };
      const msg = await ax.post("/message/send", data);
      SendMessageSignal(ID || "", msg.data);
      setContent("");
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="h-screen flex bg-gray-100">
      <aside className="w-1/3 border-r bg-white overflow-y-auto shadow-sm">
        <Home />
      </aside>

      <main className="flex-1 flex flex-col">
        <div className="p-4 border-b bg-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Empty header as requested */}
          </div>
        </div>

        {currentUser && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {Messages.map((msg: any) => {
              const isCurrentUser = msg.senderId === currentUser?.id;
              const isImage = msg.content?.startsWith?.(
                "http://localhost:5228/uploads/"
              );

              return (
                <div
                  key={msg.id}
                  className={`flex ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  } items-end gap-2`}
                >
                  {!isCurrentUser && (
                    <img
                      src={`http://localhost:5228/uploads/${msg.sender?.photo}`}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}

                  <div
                    className={`flex flex-col ${
                      isCurrentUser ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`${
                        isCurrentUser
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-white rounded-bl-none"
                      } px-4 py-2 rounded-2xl shadow max-w-xs`}
                    >
                      {isImage ? (
                        <img
                          src={msg.content}
                          alt=""
                          className="max-w-full h-auto rounded-lg"
                        />
                      ) : (
                        msg.content
                      )}
                    </div>

                    {isCurrentUser && (
                      <div className="flex items-center mt-1 space-x-1">
                        <span className="text-xs text-gray-500">
                          {msg.seen_time
                            ? get_time_diff(msg.seen_time, "seen")
                            : ""}
                        </span>
                        <span className="text-xs">
                          {msg.seen_time ? (
                            <span className="text-blue-500">✓✓</span>
                          ) : (
                            <span className="text-gray-400">✓</span> // delivered
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <form
          onSubmit={sendMessage}
          className="p-4 border-t bg-white flex items-center gap-2"
        >
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            type="text"
            placeholder="Message..."
            className="flex-1 px-4 py-2 border rounded-full bg-gray-100 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
          >
            Send
          </button>
        </form>
      </main>
    </div>
  );
}
