import { RouterProvider } from "react-router-dom";
import { Suspense } from "react";

import { useAddRealtimeMessage } from "./hooks";
import { Loading, Toaster } from "@/components";
import { router } from "@/routing";

export function App() {
    useAddRealtimeMessage();

    return (
        <>
            <Suspense fallback={<Loading />}>
                <RouterProvider router={router} />
            </Suspense>
            <Toaster />
        </>
    );
}
