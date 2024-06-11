import ReactDOM from "react-dom/client";
import ReactGA from "react-ga4";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContextProvider } from "./contexts/AuthContext";
import { getStorageModel } from "@/lib/storage";
import { auth } from "@/constants/auth";
import router from "@/router";
import "@/index.css";

const queryClient = new QueryClient();

const getStoredTheme = () => {
  const storedTheme = getStorageModel(auth.USER);
  if (storedTheme) {
    const parsedTheme = JSON.parse(storedTheme);
    if (parsedTheme.theme === "light" || parsedTheme.theme === "dark") {
      return parsedTheme.theme;
    }
  }
  return "dark";
};

ReactGA.initialize("G-61TNQ062T4");

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <AuthContextProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme={getStoredTheme()} storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  </AuthContextProvider>
  // </React.StrictMode>
);
