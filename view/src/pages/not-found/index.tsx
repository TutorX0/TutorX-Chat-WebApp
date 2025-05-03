import { Link } from "react-router-dom";

import { Button } from "@/components";
import { homeUrl } from "@/routing";

export default function NotFoundPage() {
    return (
        <main className="bg-background flex min-h-screen flex-col items-center justify-center space-y-6 text-center">
            <h1 className="text-4xl font-semibold">Page Not Found</h1>
            <Link to={homeUrl} replace>
                <Button>Back to home</Button>
            </Link>
        </main>
    );
}
