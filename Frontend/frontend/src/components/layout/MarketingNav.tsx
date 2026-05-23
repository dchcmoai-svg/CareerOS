"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { landing } from "@/lib/copy";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/product", label: "Product" },
  { href: "/discovery", label: "Find Jobs" },
  { href: "/resume-lab", label: "Resume" },
  { href: "/discoverability", label: "Get Discovered" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/about", label: "About" },
];

export function MarketingNav() {
  const pathname = usePathname();

  return (
    <header className="h-16 flex items-center justify-between px-lg relative z-50 border-b border-hairline/50 bg-canvas/80 backdrop-blur-xl sticky top-0">
      <Link href="/" className="flex items-center gap-xs font-semibold group">
        <div className="w-6 h-6 bg-ai rounded flex items-center justify-center group-hover:scale-105 transition-transform duration-150">
          <Sparkles className="w-3.5 h-3.5 text-canvas" />
        </div>
        <span className="tracking-tight text-[15px] font-bold">CareerOS</span>
      </Link>

      <nav className="hidden md:flex items-center gap-lg text-xs text-text-secondary font-semibold uppercase tracking-wider">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "hover:text-text-primary transition-colors duration-150",
              pathname === link.href && "text-text-primary"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-sm">
        <Link
          href="/sign-in"
          className="text-xs uppercase tracking-wider font-semibold text-text-secondary hover:text-text-primary transition-colors px-sm py-2"
        >
          Sign In
        </Link>
        <Button
          render={<Link href="/sign-up" />}
          nativeButton={false}
          className="h-9 px-md bg-text-primary text-canvas hover:bg-text-secondary font-bold text-xs uppercase tracking-wider shadow-[0_1px_0_rgba(255,255,255,0.1)_inset]"
        >
          {landing.ctaPrimary}
        </Button>
      </div>
    </header>
  );
}
