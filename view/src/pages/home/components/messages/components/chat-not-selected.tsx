import logo from "@/assets/logo.webp";
import { useStore } from "@/store";
import { TemplateList } from "@/pages/home/components/chat-sidebar/pills/TemplateList";
import { useSearchParams } from "react-router-dom";

export function ChatNotSelected() {
  const showTemplate = useStore((state) => state.showTemplate);
   const [searchParams] = useSearchParams();

  if (searchParams.get("chat_type") === "templates" || showTemplate) {
 return (
      <section className="bg-sidebar flex-1 overflow-y-auto scrollbar-hide">
        <TemplateList />
      </section>
    );
  }

  return (
    <section className="bg-sidebar flex grow flex-col items-center justify-center">
      <img src={logo} alt="TutorX Logo" loading="lazy" className="size-40" />
      <h1 className="mt-6 mb-1 text-4xl font-semibold">TutorX</h1>
      <h2 className="text-xl text-neutral-400">Expect the best</h2>
    </section>
  );
}
