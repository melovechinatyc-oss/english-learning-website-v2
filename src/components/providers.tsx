"use client";

import { Toaster } from "sonner";
import { LearningProvider } from "@/contexts/learning-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LearningProvider>
      {children}
      <Toaster richColors />
    </LearningProvider>
  );
}
