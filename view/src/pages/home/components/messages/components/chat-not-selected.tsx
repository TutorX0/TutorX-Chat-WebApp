import logo from "@/assets/logo.webp";

export function ChatNotSelected() {
    return (
        <section className="bg-sidebar flex grow flex-col items-center justify-center">
            <img src={logo} alt="TutorX Logo" loading="lazy" className="size-40" />
            <h1 className="mt-6 mb-1 text-4xl font-semibold">TutorX</h1>
            <h2 className="text-xl text-neutral-400">Expect the best</h2>
        </section>
    );
}
