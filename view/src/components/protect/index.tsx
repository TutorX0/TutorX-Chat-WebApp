import { Navigate, Outlet, useSearchParams } from "react-router-dom";

import { useAddRealtimeMessage, useFetchUser } from "@/hooks";
import { Loading } from "../loading";
import { loginUrl } from "@/routing";
import { useEffect, useState } from "react";

export function Protect() {
    const status = useFetchUser();
     const [searchParams] = useSearchParams();
     const [openedChat, setOpenedChat] = useState<string| null> (null)
 console.log("new chat opened: ", openedChat
 )
  useAddRealtimeMessage(openedChat);
useEffect(()=>{
    setOpenedChat(searchParams.get("open"))
}, [searchParams.get("open") ])


    if (status === "pending") return <Loading />;
    else if (status === "success") return <Outlet />;
    else if (status === "error") return <Navigate to={loginUrl} replace />;
    else return null;
}
