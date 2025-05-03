import { Navigate, Outlet } from "react-router-dom";

import { useFetchUser } from "@/hooks";
import { Loading } from "../loading";

export function Protect() {
    const status = useFetchUser();

    if (status === "pending") return <Loading />;
    else if (status === "success") return <Outlet />;
    else if (status === "error") return <Navigate to="/login" replace />;
    else return null;
}
