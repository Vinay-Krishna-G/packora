"use client";

import { useState } from "react";
import LandingPage from "@/components/landing/LandingPage";
import UploadZone from "@/components/UploadZone";

export default function Home() {
  const [view, setView] = useState<"landing" | "workspace">("landing");

  if (view === "landing") {
    return <LandingPage onOpenApp={() => setView("workspace")} />;
  }

  return <UploadZone onLogoClick={() => setView("landing")} />;
}