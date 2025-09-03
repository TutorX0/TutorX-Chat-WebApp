import { useEffect } from "react";
import { toast } from "sonner";

import { socketData, type ChatMessage } from "@/validations";
import { useSocket } from "@/context";
import { useStore } from "@/store";

// 👇 imported the audio file 
import notificationSound from "@/assets/incoming-message-online-whatsapp.mp3";

export function useAddRealtimeMessage() {
    const { socket } = useSocket();

    const pushMessage = useStore((state) => state.pushMessage);
    const moveChatToTop = useStore((state) => state.moveChatToTop);
    const updateMessageStatus = useStore((state) => state.updateMessageStatus);
        const incrementUnread = useStore((state) => state.incrementUnread);
    const user = useStore((state) => state.user); // 👈 logged-in user info

    // 🔊 inline helper to play notification sound
    const playNotification = () => {
        const audio = new Audio(notificationSound);
        audio.play().catch(() => {
            // ignore autoplay errors
        });
    };
useEffect(() => {
  if (!socket) return;

  // // 🔍 Debug: log every socket event
  socket.onAny((event, ...args) => {
    console.log("📡 [SOCKET DEBUG] Event:", event, args);
  });

     socket.on("messageStatusUpdate", (data) => {
            console.log("📊 [SOCKET messageStatusUpdate RAW DATA]", data);

         

            // Update message status using your existing method signature
            updateMessageStatus(data.chatId, data.whatsappMessageId, data.status);
        });

  socket.on("newMessage", (data) => {
    console.log("📥 [SOCKET newMessage RAW DATA]", data);

    const parsedResponse = socketData.safeParse(data);
    if (!parsedResponse.success) return toast.error("Invalid data type sent from server");

    const chatDetails = {
      chatId: parsedResponse.data.chatId,
      chatName: parsedResponse.data.chatName,
      phoneNumber: parsedResponse.data.phoneNumber,
      chat_id: parsedResponse.data.chat_id
    };

    const newMessage: ChatMessage = {
      _id: parsedResponse.data.messageId,
      createdAt: parsedResponse.data.timestamp,
      fileName: parsedResponse.data.fileName,
      mediaUrl: parsedResponse.data.mediaUrl,
      sender: parsedResponse.data.sender,
      type: parsedResponse.data.messageType,
      whatsappMessageId: parsedResponse.data.whatsappMessageId,
      content: parsedResponse.data.content,
      replyTo: parsedResponse.data.replyTo,
      isForwarded: parsedResponse.data.isForwarded,
      status: parsedResponse.data.status
    };

    pushMessage(chatDetails, newMessage);
    moveChatToTop(parsedResponse.data.phoneNumber);

    const isOwnMessage =
      newMessage.sender === "admin" || 
      newMessage.sender === user?.id;

  if (!isOwnMessage) {
    console.log("not own message")
                // 👈 Increment unread count for incoming messages
                incrementUnread(parsedResponse.data.chatId);
                playNotification();
            }
  });

  return () => {
    socket.offAny();
    socket.off("newMessage");
    socket.off("messageStatusUpdate")
  };
}, [socket, pushMessage, moveChatToTop, incrementUnread, updateMessageStatus, user]);

}
