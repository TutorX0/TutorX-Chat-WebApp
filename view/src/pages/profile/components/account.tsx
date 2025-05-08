import { useStore } from "@/store";

export function Account() {
    const user = useStore((state) => state.user);

    return (
        <section className="mx-auto flex w-full max-w-2xl grow flex-col justify-center p-5">
            <p className="mb-1 text-neutral-400 sm:text-lg md:text-base lg:text-lg">E-mail</p>
            <p className="break-all sm:text-lg md:text-base lg:text-lg">{user?.email}</p>
        </section>
    );
}
