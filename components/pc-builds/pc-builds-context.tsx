"use client";

import React, { createContext, useContext } from "react";
import { usePcBuilds } from "@/hooks/use-pc-builds";

type PcBuildsContextType = ReturnType<typeof usePcBuilds>;

const PcBuildsContext = createContext<PcBuildsContextType | undefined>(
  undefined
);

export function PcBuildsProvider({ children }: { children: React.ReactNode }) {
  const pcBuildsHook = usePcBuilds();

  return (
    <PcBuildsContext.Provider value={pcBuildsHook}>
      {children}
    </PcBuildsContext.Provider>
  );
}

export function usePcBuildsContext() {
  const context = useContext(PcBuildsContext);
  if (context === undefined) {
    throw new Error(
      "usePcBuildsContext must be used within a PcBuildsProvider"
    );
  }
  return context;
}
