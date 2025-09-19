// chat-sidebar.tsx
import { Search } from "lucide-react";
import { useState } from "react";
import { useFetchChats, useFetchGroups } from "@/hooks";
import { ChatItems } from "./chat-items";
import { Input } from "@/components";
import { useStore } from "@/store";
import { Pills } from "./pills";
import { useSearchParams } from "react-router-dom";
import { useMediaQuery } from "usehooks-ts";
import { TemplateList } from "./pills/TemplateList";

export function ChatSidebar() {
  const [search, setSearch] = useState("");
  const { loading } = useFetchChats();
  useFetchGroups();

  const groups = useStore((state) => state.groups);
  const chats = useStore((state) => state.chats);

  const [searchParams, setSearchParams] = useSearchParams();
  const chatType = (searchParams.get("chat_type") || "").toLowerCase();

  const isMobile = useMediaQuery("(max-width: 768px)");

  const pillTitles = ["Chats", "Templates", ...(groups ? groups.map((group) => group.groupName) : [])];

  const closeTemplates = () => {
    // remove chat_type param (closes the templates overlay)
    const sp = new URLSearchParams(searchParams.toString());
    sp.delete("chat_type");
    setSearchParams(sp);
  };

  return (
    <>
      {/* Sidebar (stays in the layout) */}
      <aside className="bg-sidebar flex grow flex-col gap-4 border pt-5 min-h-0 overflow-hidden">
        {/* Search box */}
        <div className="relative px-4">
          <Search className="absolute top-1/2 left-7 size-4 -translate-y-1/2 text-neutral-500" />
          <Input
            type="text"
            placeholder="Search ...."
            className="focus-visible:ring-empty-input-border bg-empty-input focus-visible:bg-sidebar rounded-full pl-9 focus-visible:ring-1"
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Pills */}
        <Pills pillTitles={pillTitles} />

        {/* Either show chat list (desktop / normal) or keep an empty flex area (mobile -> overlay will show) */}
        {!(isMobile && chatType === "templates") ? (
          <ChatItems chats={chats} loading={loading} search={search} />
        ) : (
          <div className="flex-1" />
        )}
      </aside>

      {/* MOBILE: full-screen overlay for templates so your TemplateList's h-screen + scroll is preserved */}
      {isMobile && chatType === "templates" && (
        <div className="fixed inset-0 z-50 bg-[#161717]">
          <div className="relative h-full">
            {/* Close button (top-left) */}
            <div className="absolute top-4 left-4 z-50">
              <button
                onClick={closeTemplates}
                aria-label="Close templates"
                className="inline-flex items-center justify-center rounded-full p-2 bg-[#1c1c1c] text-white shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Keep your TemplateList exactly as-is (it uses h-screen) */}
            <TemplateList />
          </div>
        </div>
      )}
    </>
  );
}
