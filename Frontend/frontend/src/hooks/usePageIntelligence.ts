"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCareerGraph } from "@/lib/career-graph";
import type { PageContext } from "@/lib/career-graph";

function pathnameToContext(pathname: string): PageContext {
  if (pathname.includes("/jobs")) return "discovery";
  if (pathname.includes("/tracker")) return "tracker";
  if (pathname.includes("/resume")) return "ats";
  if (pathname.includes("/marketplace")) return "marketplace";
  if (pathname.includes("/profile")) return "profile";
  return "global";
}

export function usePageIntelligence() {
  const pathname = usePathname();
  const setPageContext = useCareerGraph((s) => s.setPageContext);

  useEffect(() => {
    setPageContext(pathnameToContext(pathname));
  }, [pathname, setPageContext]);
}
