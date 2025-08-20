import { useState } from "react";

import { LoginLogo } from "./components/login-logo";
import { NeedHelp } from "./components/need-help";
import { Email } from "./components/email";
import { Otp } from "./components/otp";
import logo from "@/assets/logo.webp";

export default function LoginPage() {
    const [emailSent, setEmailSent] = useState(false);
    const [email, setEmail] = useState("");

    return (
        <div className="bg-wp flex min-h-screen flex-col justify-center px-5 py-4 text-black">
            <header className="flex items-center gap-4">
                <img src={logo} alt="TutorX Logo" loading="lazy" className="size-8" />
                <span className="text-2xl font-medium text-[#2559A2]">TutorX</span>
            </header>
            <main className="mx-auto flex max-w-5xl grow flex-col justify-center">
                <div className="mt-10 mb-5 flex flex-col items-center gap-x-8 gap-y-4 rounded-3xl border border-black bg-white px-6 py-6 sm:px-16 md:flex-row">
                    <LoginLogo />
                    <p className="max-w-[33rem] text-center text-xl md:text-left">
                        Your messages, always accessible - verify your identity with <strong>OTP</strong> and start chatting
                        instantly.
                    </p>
                </div>
                <div className="flex flex-col items-center gap-8 rounded-3xl border border-black bg-white px-6 py-6 sm:px-16 lg:flex-row">
                    <div>
                        <h1 className="text-center text-3xl sm:text-4xl lg:text-left">Login to TutorX</h1>
                        <p className="mt-4 text-center text-lg text-[#565353] lg:text-left">
                            Connect to your real-time chats securely through email address verification and OTP authentication
                        </p>
                        <div className="my-10">
                            <Email emailSent={emailSent} setEmailSent={setEmailSent} setEmail={setEmail} />
                            {emailSent ? <Otp email={email} /> : null}
                        </div>
                        <NeedHelp />
                    </div>
                    <div className="-order-1 flex shrink-0 items-center justify-center lg:order-1">
                        <img src={logo} alt="TutorX Logo" loading="lazy" className="size-48 sm:size-52 md:size-60 lg:size-80" />
                    </div>
                </div>
                <p className="mt-6 text-center text-sm">Copyrights @ {new Date().getFullYear()}. All right reserved to WCPL</p>
            </main>
        </div>
    );
}
