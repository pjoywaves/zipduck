import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./contexts/ThemeContext";
import { queryClient } from "./lib/queryClient";
import { router } from "./router";
import "@/styles/index.css";

// Feature flag to toggle between router and legacy state-based navigation
const USE_ROUTER = import.meta.env.VITE_USE_ROUTER === "true";

// Legacy App import for demo mode
const LegacyApp = React.lazy(() => import("./App").then(m => ({ default: m.App })));

function Root() {
  if (USE_ROUTER) {
    return <RouterProvider router={router} />;
  }

  // Legacy mode - use state-based navigation for demo
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <LegacyApp />
    </React.Suspense>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Root />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
