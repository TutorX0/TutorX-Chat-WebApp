import { useState, type PropsWithChildren } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components";
import { Button, Checkbox, ScrollArea } from "@/components";
import { useStore } from "@/store";
import { axiosClient } from "@/lib";
import { AxiosError } from "axios";
import { toast } from "sonner";

type ForwardTemplateProps = PropsWithChildren<{
  templateName: string;
  language: string;
}>;

export function ForwardTemplate({ templateName, language, children }: ForwardTemplateProps) {
  const [selectedPhoneNumbers, setSelectedPhoneNumbers] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const chats = useStore((state) => state.chats);

  const allPhoneNumbers = chats.map((chat) => chat.phoneNumber);
  const isAllSelected = selectedPhoneNumbers.length === allPhoneNumbers.length;

  function handleSelectChat(currentChatPhoneNumber: string) {
    if (loading) return;
    if (selectedPhoneNumbers.includes(currentChatPhoneNumber)) {
      setSelectedPhoneNumbers((prev) => prev.filter((phoneNumber) => phoneNumber !== currentChatPhoneNumber));
    } else {
      setSelectedPhoneNumbers((prev) => [...prev, currentChatPhoneNumber]);
    }
  }

  function handleSelectAll() {
    if (loading) return;
    if (isAllSelected) {
      setSelectedPhoneNumbers([]); // unselect all
    } else {
      setSelectedPhoneNumbers(allPhoneNumbers); // select all
    }
  }

  function resetForwarding() {
    setSelectedPhoneNumbers([]);
    setOpen(false);
  }

  async function forwardTemplate() {
    if (!selectedPhoneNumbers.length || loading) return;

    setLoading(true);
    try {
      await axiosClient.post("/whatsapp/send-template", {
        templateName,
        language,
        contacts: selectedPhoneNumbers,
      });
      toast.success("Template sent successfully");
      setSelectedPhoneNumbers([]);
      setOpen(false);
    } catch (error: unknown) {
      let message = "An unexpected error was returned from the server";
      if (error instanceof AxiosError) message = error?.response?.data?.message;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send template "{templateName}"</DialogTitle>
        </DialogHeader>

        {/* ✅ Select All checkbox */}
        <div
          className="my-2 flex cursor-pointer items-center justify-between gap-x-4 rounded-md border px-4 py-3"
          onClick={handleSelectAll}
        >
          <p className="font-medium">Select All</p>
          <Checkbox checked={isAllSelected} />
        </div>

        <ScrollArea className="h-full max-h-[40vh] pr-3">
          {chats.map((chat) => (
            <div
              key={`Select-chat-id-${chat._id}`}
              className="my-2 flex cursor-pointer items-start justify-between gap-x-4 rounded-md border px-4 py-3"
              onClick={() => handleSelectChat(chat.phoneNumber)}
            >
              <p>{chat.name}</p>
              <Checkbox checked={selectedPhoneNumbers.includes(chat.phoneNumber)} />
            </div>
          ))}
        </ScrollArea>

        <DialogFooter className="z-10 flex flex-row items-center justify-center gap-x-4 pr-3">
          <Button variant="outline" className="rounded-full" onClick={resetForwarding}>
            Cancel
          </Button>
          <Button variant="secondary" className="rounded-full" loading={loading} onClick={forwardTemplate}>
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
