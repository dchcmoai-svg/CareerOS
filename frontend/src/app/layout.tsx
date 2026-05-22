import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CareerOS | The smarter way to manage your career",
  description: "Find jobs, improve your resume, track applications, and get discovered — in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <SessionProvider>
          {children}
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--color-surface-2)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "var(--color-text-primary)",
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
