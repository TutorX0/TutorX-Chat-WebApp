import { ProfileDropDown } from "./profile-drop-down";
import { AddNumber } from "./add-number";
import logo from "@/assets/logo.webp";

export function Header() {
    return (
        <header className="bg-header flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-4">
                <img src={logo} alt="TutorX Logo" loading="lazy" className="size-8" />
                <span className="text-sm">TutorX</span>
            </div>
            <div className="flex items-center gap-x-2">
                <AddNumber />
                <ProfileDropDown />
            </div>
        </header>
    );
}
