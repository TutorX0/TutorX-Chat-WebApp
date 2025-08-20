import "@/styles/globals.css";

import { createRoot } from "react-dom/client";
import { StrictMode } from "react";

import { SocketProvider } from "./context";
import { App } from "./app";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <SocketProvider>
            <App />
        </SocketProvider>
    </StrictMode>
);
