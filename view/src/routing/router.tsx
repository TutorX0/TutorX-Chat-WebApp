import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

import { Protect } from "@/components";
import * as routes from "./routes";
import * as Page from "./imports";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/">
            <Route element={<Protect />}>
                <Route path={routes.homeUrl} element={<Page.HomePage />} />
            </Route>
            <Route path={routes.loginUrl} element={<Page.LoginPage />} />
            <Route path="*" element={<Page.NotFoundPage />} />
        </Route>
    )
);
