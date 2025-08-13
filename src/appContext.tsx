import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
} from "@microsoft/signalr";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  useMemo,
} from "react";
import axiosClient from "./axiosClient";

interface AppContextType {
  global: string;
  setGlobal: (value: string) => void;
  StartConversation: (ID: string) => Promise<void>;
  LeaveConversation: (ID: string) => Promise<void>;
  SendMessageSignal: (conv: string | undefined ,data : any) => Promise<void>;
  currentUser : any | null,
  connection: HubConnection

}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {

  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const ax = axiosClient()

 
  // useMemo is a React Hook that memoizes (remembers) the result of a function between renders. It only recomputes 
  // the value when its dependencies change.

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

  const [connectionId, setConnectionId] = useState<string>("");
  const [global, setGlobal] = useState<string>("");

  useEffect(() => {
    const start = async () => {
      try {
        connection.on("getMyConnectionId", (id) => {
          setConnectionId(id);
          console.log("Received connectionId from server:", id);
        });

        await connection.start();
        console.log(
          "SignalR connected with connectionId:",
          connection.connectionId
        );
      } catch (error) {
        console.error("SignalR Connection Failed", error);
      }
    };
    start();

    const fetchUser = async () => {
      try {
        const res = await ax.get("/auth/current");
        setCurrentUser(res.data);
      } catch {
        setCurrentUser(null);
      }
    };

    fetchUser();

    return () => {
      connection.stop().catch(console.error);
    };
  }, [connection]);

  const StartConversation = async (ID: string) => {
    try {
      if (connection.state === "Connected") {
        await connection.invoke("onConversationStart", ID);
        console.log("user on group", ID);
      } else {
        console.warn("SignalR connection not connected yet");
      }
    } catch (error) {
      console.error("StartConversation error:", error);
    }
  };

  const LeaveConversation = async (ID: string) => {
    try {
      if (connection.state === "Connected") {
        await connection.invoke("onConversationLeave", ID);
        console.log("user off group", ID);
      } else {
        console.warn("SignalR connection not connected yet");
      }
    } catch (error) {
      console.error("LeaveConversation error:", error);
    }
  };

  const SendMessageSignal = async(conv: string | undefined,message : any)=>{
    try {
      if( connection.state == "Connected")
      await connection.invoke("sendMessage",conv,message );
      console.log("message sent");
      
    } catch (error) {
      console.error("LeaveConversation error:", error);

    }
  }


  // connection.on("ReceiveMessage",(msg)=>{
  //   // add it to the state
  // })

  return (
    <AppContext.Provider
      value={{ global, setGlobal, StartConversation, LeaveConversation,SendMessageSignal,currentUser,connection }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
