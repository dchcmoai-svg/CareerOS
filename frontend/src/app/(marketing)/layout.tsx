import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SmoothScrollProvider>{children}</SmoothScrollProvider>;
}
