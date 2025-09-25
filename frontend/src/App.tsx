import React from "react";
import { ClerkProvider } from "@clerk/clerk-react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConvexProviderWrapper } from "@/components/ConvexProvider";
import { UserProfileProvider } from "@/components/UserProfileProvider";
import { TopNavigation } from "@/components/navigation/TopNavigation";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { AIAssistant } from "@/components/ai/AIAssistant";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "@/pages/index";
import ClinicalDocs from "./pages/ClinicalDocs";
import Symptomate from "./pages/Symptomate";
import Medicine from "./pages/Medicine";
import Cart from "./pages/Cart";
import Reminders from "./pages/Reminders";
import LabTests from "./pages/LabTests";
import Doctors from "./pages/Doctors";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Get your publishable key from env vars
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_demo_key_for_development';
// Treat demo key as not configured to avoid runtime errors and white screen
const IS_CLERK_CONFIGURED = !!PUBLISHABLE_KEY && PUBLISHABLE_KEY !== 'pk_test_demo_key_for_development';
if (!IS_CLERK_CONFIGURED) {
  console.warn("Clerk is not fully configured. Running without authentication for development.");
}

const App = () => {
  // If Clerk is not configured (including demo key), render without authentication
  if (!IS_CLERK_CONFIGURED) {
    return (
      <ConvexProviderWrapper>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen w-full bg-background">
                <TopNavigation />
                <main className="w-full">
                  <ErrorBoundary>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/clinical-docs" element={<ClinicalDocs />} />
                      <Route path="/sehatbeat-ai" element={<Symptomate />} />
                      <Route path="/medicine" element={<Medicine />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/reminders" element={<Reminders />} />
                      <Route path="/lab-tests" element={<LabTests />} />
                      <Route path="/doctors" element={<Doctors />} />
                      {/* Legacy route redirect */}
                      <Route path="/symptomate" element={<Symptomate />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </ErrorBoundary>
                </main>
                <BottomNavigation />
                <AIAssistant />
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ConvexProviderWrapper>
    );
  }

  // Render with Clerk authentication and Convex
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ConvexProviderWrapper>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <UserProfileProvider>
                <div className="min-h-screen w-full bg-background">
                  <TopNavigation />
                  <main className="w-full">
                    <ErrorBoundary>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/clinical-docs" element={<ClinicalDocs />} />
                        <Route path="/sehatbeat-ai" element={<Symptomate />} />
                        <Route path="/medicine" element={<Medicine />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/reminders" element={<Reminders />} />
                        <Route path="/lab-tests" element={<LabTests />} />
                        <Route path="/doctors" element={<Doctors />} />
                        {/* Legacy route redirect */}
                        <Route path="/symptomate" element={<Symptomate />} />
                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </ErrorBoundary>
                  </main>
                  <BottomNavigation />
                  <AIAssistant />
                </div>
              </UserProfileProvider>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ConvexProviderWrapper>
    </ClerkProvider>
  );
};

export default App;
