"use client";
import { CircleUserRound } from "lucide-react";
import { usePathname, useRouter } from "next/navigation"; 
import React from "react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname(); 

  const getPageTitle = (path: string): string => {
    switch (path) {
      case "/": return "Wszystko";
      case "/library": return "Biblioteka";
      case "/search": return "Szukaj";
      default:
        if (path.startsWith("/albumy/")) return "Album";
        return "";
    }
  };

  const title = getPageTitle(pathname);

  return (
    <div className="fixed top-0 left-0 bg-black text-white p-3 w-full flex items-center border-b border-white/40 z-20">
      {/* Ikona użytkownika - klik przenosi na stronę logowania */}
      <CircleUserRound
        size={32}
        className="cursor-pointer"
        onClick={() => router.push("/login")}
      />

      <div className="ml-3 text-xl font-semibold">{title}</div>
    </div>
  );
}
