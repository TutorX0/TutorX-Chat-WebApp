import { RouterProvider } from "react-router-dom";
import { Suspense } from "react";

import { Loading, Toaster } from "@/components";
import { SocketProvider } from "./context";
import { router } from "@/routing";

export function App() {
    return (
        <SocketProvider>
            <Suspense fallback={<Loading />}>
                <RouterProvider router={router} />
            </Suspense>
            <Toaster />
        </SocketProvider>
    );
}
