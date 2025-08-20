/**
 * Profile
 * - DP (TutorX)
 * - name (editable)
 * - about (editable)
 * - number from backend (whatsapp meta)
 * - Logout
 * Account
 * - Email-address
 */

import { useSearchParams } from "react-router-dom";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components";
import { ProfileSidebar } from "./components/sidebar";
import { Account } from "./components/account";
import { Profile } from "./components/profile";
import { Header } from "./components/header";

export default function ProfilePage() {
    const [searchParams] = useSearchParams();
    const openedTab = searchParams.get("tab");

    return (
        <div className="flex min-h-screen flex-col">
            <Header currentTab={openedTab} />
            <main className="flex grow flex-col">
                <ResizablePanelGroup direction="horizontal" className="grow">
                    <ResizablePanel maxSize={50} minSize={20} defaultSize={30} className="hidden flex-col md:flex">
                        <ProfileSidebar currentTab={openedTab} />
                    </ResizablePanel>
                    <ResizableHandle withHandle className="hidden flex-col md:flex" />
                    <ResizablePanel className="flex flex-col">
                        {openedTab === "profile" ? <Profile /> : null}
                        {openedTab === "account" ? <Account /> : null}
                    </ResizablePanel>
                </ResizablePanelGroup>
            </main>
        </div>
    );
}
