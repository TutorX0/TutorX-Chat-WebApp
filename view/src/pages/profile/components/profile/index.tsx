import logo from "@/assets/logo.webp";
import { Logout } from "./logout";
import { About } from "./about";
import { Name } from "./name";

export function Profile() {
    const phoneNumber = "+917903375044";

    function formatPhoneNumber(input: string) {
        const cleaned = input.replace(/[^\d+]/g, "");

        let country_code = "";
        let number = "";

        if (cleaned.startsWith("+")) {
            const rest = cleaned.slice(1);
            if (rest.length > 10) {
                country_code = "+" + rest.slice(0, rest.length - 10);
                number = rest.slice(-10);
            } else {
                country_code = "+" + rest.slice(0, rest.length - 7);
                number = rest.slice(-7);
            }
        } else {
            if (cleaned.length > 10) {
                country_code = cleaned.slice(0, cleaned.length - 10);
                number = cleaned.slice(-10);
            } else {
                country_code = cleaned.slice(0, cleaned.length - 7);
                number = cleaned.slice(-7);
            }
        }

        const blocks = [];
        if (number.length > 0) {
            blocks.push(number.slice(0, 4));
            number = number.slice(4);
        }
        while (number.length > 0) {
            blocks.push(number.slice(0, 3));
            number = number.slice(3);
        }

        return `${country_code} ${blocks.join(" ")}`;
    }

    return (
        <section className="mx-auto flex w-full max-w-2xl grow flex-col justify-center p-5">
            <img src={logo} alt="TutorX Logo" loading="lazy" className="size-40" />
            <div className="mt-8 space-y-8">
                <Name />
                <About />
                <div>
                    <p className="mb-1 text-neutral-400 sm:text-lg">Phone</p>
                    <p className="sm:text-lg">{formatPhoneNumber(phoneNumber)}</p>
                </div>
                <Logout />
            </div>
        </section>
    );
}
