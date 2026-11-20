import type { Metadata } from "next";
import Image from "next/image";

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
    <div className="min-h-screen bg-[#f6efe6] text-[#261c16] selection:bg-[#740707] selection:text-white antialiased relative overflow-x-hidden">
      {/* Background Peacock Emblem Watermark */}
      <div
        className="fixed inset-0 pointer-events-none select-none flex items-center justify-center opacity-[0.06] z-0 overflow-hidden"
        aria-hidden="true"
      >
        <Image
          src="/assets/monagrow-peacock-watermark.png"
          alt=""
          width={650}
          height={650}
          priority
          unoptimized
          className="object-contain max-w-[65vw] max-h-[65vh]"
        />
      </div>

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
