import { lazy } from "react";

export const NotFoundPage = lazy(() => import("@/pages/not-found"));
export const ProfilePage = lazy(() => import("@/pages/profile"));
export const LoginPage = lazy(() => import("@/pages/login"));
export const HomePage = lazy(() => import("@/pages/home"));
