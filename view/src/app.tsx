import { RouterProvider } from "react-router-dom";
import { Suspense } from "react"
import { Loading, Toaster } from "@/components";
import { router } from "@/routing";

export function App() {


    return (
        <>
            <Suspense fallback={<Loading />}>
                <RouterProvider router={router} />
            </Suspense>
            <Toaster />
        </>
    );
}
