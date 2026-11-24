import React from "react";
import { Metadata } from "next";
import RicePageClient from "./RicePageClient";

export const metadata: Metadata = {
  title: "Monagrow Rice | Premium, Classic & Rozana Basmati Rice (Steam & Sella)",
  description:
    "Explore Monagrow's export-quality Basmati rice portfolio: Premium Basmati Steam, Classic Basmati Steam, Rozana Basmati Steam, Premium Basmati Sella, Classic Basmati Sella, and Rozana Basmati Sella Rice.",
};

export default function RicePage() {
  return <RicePageClient />;
}
