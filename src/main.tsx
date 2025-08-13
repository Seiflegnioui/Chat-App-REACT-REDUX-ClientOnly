// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppContextProvider } from "./appContext.tsx";
import { Provider } from "react-redux";
import {store} from "./store.ts"
import { RouterProvider } from "react-router-dom";
import {router } from "./router.tsx"

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
    <AppContextProvider>
      <Provider store={store}>
        <RouterProvider router={router}/>
          {/* <App /> */}
      </Provider>
    </AppContextProvider>
  // </StrictMode>
);
