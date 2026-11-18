import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Monagrow Admin Portal | Wholesale Commodity Management",
  description: "Administrative dashboard for managing Monagrow website content, products, weight variations, images, and Neon database.",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f6efe6] text-[#261c16] selection:bg-[#740707] selection:text-white antialiased">
      {children}
    </div>
  );
}
