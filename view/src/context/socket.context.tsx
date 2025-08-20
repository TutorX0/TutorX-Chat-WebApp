import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";
import io, { type Socket } from "socket.io-client";

const SocketContext = createContext<{ socket: Socket | null }>({ socket: null });

export function SocketProvider({ children }: PropsWithChildren) {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = import.meta.env.PROD ? io() : io("http://localhost:3000");
        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
}

export function useSocket() {
    const socketContext = useContext(SocketContext);
    if (!socketContext) throw new Error("Please wrap the application in SocketProvider");
    return socketContext;
}
