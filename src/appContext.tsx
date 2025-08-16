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
  StartConversation: (ID: string) => Promise<void>;
  LeaveConversation: (ID: string) => Promise<void>;
  SendMessageSignal: (conv: string | undefined ,data : any) => Promise<void>;
  setConnection : (hub:HubConnection)=>void ,
  connection: HubConnection,
  CurrConv: number,
  setCurrConv :(id : number)=> void;

}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {

  // const [currentUser, setCurrentUser] = useState<any | null>(null);
  // const ax = axiosClient()

 
  // useMemo is a React Hook that memoizes (remembers) the result of a function between renders. It only recomputes 
  // the value when its dependencies change.

  const InitConnection = useMemo(() => {
    return new HubConnectionBuilder()
      .withUrl("ws://localhost:5228/chat", {
        accessTokenFactory: () => localStorage.getItem("TOKEN") ?? "",
        transport: HttpTransportType.WebSockets,
        skipNegotiation: true,
      })
      .withAutomaticReconnect()
      .build();
  }, []);

  const [connection, setConnection] = useState<HubConnection>(InitConnection);
  const [CurrConv, setCurrConv] = useState<number>(0);

useEffect(()=>{
  connection.on("getMyConnectionId",(str)=>{
    console.log(str);
    
  })
},[connection])

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
      value={{  StartConversation, LeaveConversation,SendMessageSignal,connection,setConnection,CurrConv,setCurrConv }}
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
