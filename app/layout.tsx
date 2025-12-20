import type React from "next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nexora Admin",
  description: "Admin Dashboard for Nexora",
  generator: "v0.app",
  icons: {
    icon: "/logononame.png",
    shortcut: "/logononame.png",
    apple: "/logononame.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
          <Toaster />

          {/* SVG Filters for image enhancement */}
          <svg className="image-filters" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="sharpen">
                <feConvolveMatrix
                  order="3 3"
                  kernelMatrix="0 -1 0 -1 5 -1 0 -1 0"
                  divisor="1"
                  bias="0"
                  targetX="1"
                  targetY="1"
                />
              </filter>

              <filter id="unsharp-mask">
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="0.5"
                  result="blur"
                />
                <feColorMatrix
                  in="blur"
                  type="matrix"
                  values="-1 0 0 0 0.5 0 -1 0 0 0.5 0 0 -1 0 0.5 0 0 0 1 0"
                  result="inverted"
                />
                <feComposite
                  in="SourceGraphic"
                  in2="inverted"
                  operator="arithmetic"
                  k1="0"
                  k2="1.5"
                  k3="1.5"
                  k4="0"
                />
              </filter>

              <filter id="edge-enhance">
                <feConvolveMatrix
                  order="3 3"
                  kernelMatrix="-1 -1 -1 -1 9 -1 -1 -1 -1"
                  divisor="1"
                  bias="0"
                />
              </filter>
            </defs>
          </svg>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
