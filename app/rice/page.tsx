import React from "react";
import { Metadata } from "next";
import RicePageClient from "./RicePageClient";

export const metadata: Metadata = {
  title: "Monagrow Rice | Premium Basmati, Katarni, Jeera Masino & Sona Masoori",
  description:
    "Explore Monagrow's export-quality rice portfolio: Premium Basmati Steam, Premium Katarni Rice, Premium Basmati Brown Rice, Premium Basmati Sella, Jeera Masino Rice, and Premium Sona Masoori Rice.",
};

export default function RicePage() {
  return <RicePageClient />;
}
