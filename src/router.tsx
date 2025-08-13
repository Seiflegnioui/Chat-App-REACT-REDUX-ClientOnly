import { createBrowserRouter } from "react-router-dom";
import GuestLayout  from "./components/layouts/GuestLayout"
import Register  from "./components/Auth/Register"
import Login from "./components/Auth/Login";
import Home from "./components/User/Home";
import UsersLayout from "./components/layouts/UsersLayout";
import Chat from "./components/User/Chat";

export const router = createBrowserRouter([
    {
        path:"auth",
        element: <GuestLayout/>,
        children: [
            {
                path:"register",
                element: <Register/>
            },
            {
                path:"login",
                element: <Login/>
            },
        ]

    },
      {
        path:"user",
        element: <UsersLayout/>,
        children: [
            {
                path:"home",
                element: <Home/>
            },
            {
                path:"chat/:ID",
                element: <Chat/>
            },
        
        ]

    }
])