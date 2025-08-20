import { createElement, useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import "emoji-picker-element";

type EmojiClickDetail = {
    emoji: {
        name: string;
        shortcodes?: string[];
        unicode: string;
    };
    skinTone: number;
    unicode: string;
};

type EmojiClickEvent = {
    isTrusted: boolean;
    bubbles: boolean;
    cancelBubble: boolean;
    cancelable: boolean;
    composed: boolean;
    currentTarget: EventTarget | null;
    defaultPrevented: boolean;
    detail: EmojiClickDetail;
    eventPhase: number;
    returnValue: boolean;
    srcElement: HTMLElement;
    target: HTMLElement;
    timeStamp: number;
    type: "emoji-click";
};

type EmojiProps = {
    setMessage: Dispatch<SetStateAction<string>>;
};

export function Picker({ setMessage }: EmojiProps) {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const reference = ref.current;
        if (!reference) return;

        function handleEmojiClickEvent(event: Event) {
            const emojiEvent = event as unknown as EmojiClickEvent;
            setMessage((prev) => prev + emojiEvent.detail.unicode);
        }

        reference.addEventListener("emoji-click", handleEmojiClickEvent);

        return () => reference.removeEventListener("emoji-click", handleEmojiClickEvent);
    }, []);

    return createElement("emoji-picker", { ref });
}
