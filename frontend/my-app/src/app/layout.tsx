import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/utils/cn";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "늘봄케어 (Neulbom Care)",
  description: "AI 기반 간병인 맞춤 매칭 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={cn(
          "min-h-screen bg-gray-100 font-sans antialiased flex justify-center"
        )}
      >
        <div className="w-full max-w-[430px] min-h-screen bg-background relative shadow-2xl flex flex-col">
          <Header />
          <main className="flex-1 pb-16 overflow-y-auto">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
