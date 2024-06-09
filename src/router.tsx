import { createBrowserRouter } from "react-router-dom";
import GeneralError from "./pages/errors/general-error";
import NotFoundError from "./pages/errors/not-found-error";
import MaintenanceError from "./pages/errors/maintenance-error";

const router = createBrowserRouter([
  // Auth routes
  {
    path: "/auth/login",
    lazy: async () => ({
      Component: (await import("./pages/auth/sign-in")).default,
    }),
  },
  {
    path: "/auth/register",
    lazy: async () => ({
      Component: (await import("./pages/auth/sign-up")).default,
    }),
  },
  {
    path: "/forgot-password",
    lazy: async () => ({
      Component: (await import("./pages/auth/forgot-password")).default,
    }),
  },

  // Main routes
  {
    path: "/",
    lazy: async () => {
      const AppShell = await import("./App");
      return { Component: AppShell.default };
    },
    errorElement: <GeneralError />,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import("./pages/dashboard")).default,
        }),
      },
      {
        path: "manga/:name",
        lazy: async () => ({
          Component: (await import("./pages/manga")).default,
        }),
      },
      {
        path: "ler-manga/:name/:chapter",
        lazy: async () => ({
          Component: (await import("./pages/manga-reading")).default,
        }),
      },
      {
        path: "highscores",
        lazy: async () => ({
          Component: (await import("./pages/highscores")).default,
        }),
      },
    ],
  },
  {
    path: "settings",
    lazy: async () => ({
      Component: (await import("./pages/settings")).default,
    }),
    errorElement: <GeneralError />,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import("./pages/settings/profile")).default,
        }),
      },
      {
        path: "account",
        lazy: async () => ({
          Component: (await import("./pages/settings/account")).default,
        }),
      },
      {
        path: "appearance",
        lazy: async () => ({
          Component: (await import("./pages/settings/appearance")).default,
        }),
      },
      {
        path: "notifications",
        lazy: async () => ({
          Component: (await import("./pages/settings/notifications")).default,
        }),
      },
      {
        path: "display",
        lazy: async () => ({
          Component: (await import("./pages/settings/display")).default,
        }),
      },
    ],
  },

  // Error routes
  { path: "/500", Component: GeneralError },
  { path: "/404", Component: NotFoundError },
  { path: "/503", Component: MaintenanceError },

  // Fallback 404 route
  { path: "*", Component: NotFoundError },
]);

export default router;
