import { useNavigate } from "react-router-dom";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    Button
} from "@/components";
import { loginUrl } from "@/routing";
import { useStore } from "@/store";

export function Logout() {
    const logout = useStore((state) => state.logout);
    const navigate = useNavigate();

    function onLogout() {
        logout();
        navigate(loginUrl, { replace: true });
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="secondary" className="rounded-full">
                    Logout
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. You will be logged out of your account, but you can log in again at any
                        time.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onLogout}>Logout</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
