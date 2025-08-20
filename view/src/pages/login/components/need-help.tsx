import { TriangleAlert } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components";

export function NeedHelp() {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className="mx-auto flex w-max cursor-pointer items-center justify-center gap-3 text-center lg:mx-0 lg:justify-start lg:text-left">
                    <span className="text-lg text-[#2f5186]">Need help getting started?</span>
                    <TriangleAlert className="size-5 text-yellow-700" />
                </div>
            </PopoverTrigger>
            <PopoverContent side="top" align="start" className="w-full bg-[#F9F6F2] break-words text-black shadow-2xl">
                <ol>
                    <li>
                        1. Enter your registered <span className="font-bold italic">email</span>
                    </li>
                    <li>
                        2. Click the <span className="font-bold italic">&quot;Login&quot;</span> button to request an OTP.
                    </li>
                    <li>
                        3. Check your inbox or SMS for the <span className="font-bold italic">OTP</span>.
                    </li>
                    <li>4. Enter the OTP in the verification field.</li>
                    <li>
                        5. Click <span className="font-bold italic">&quot;Verify&quot;</span> to complete your login .
                    </li>
                </ol>
            </PopoverContent>
        </Popover>
    );
}
