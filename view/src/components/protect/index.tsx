import { Navigate, Outlet } from "react-router-dom";

import { useFetchUser } from "@/hooks";
import { Loading } from "../loading";
import { loginUrl } from "@/routing";

export function Protect() {
    const status = useFetchUser();

    if (status === "pending") return <Loading />;
    else if (status === "success") return <Outlet />;
    else if (status === "error") return <Navigate to={loginUrl} replace />;
    else return null;
}
