import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {ClerkProvider} from "@clerk/nextjs"
import {ThemeProvider} from "next-themes"
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s - THEMES",
    absolute: "SensAI - THEMES",
  },
  description:
    "THEMES is the easiest way to create a professional resume that will help you land your dream job.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

   <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          
        <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        >
          {children}

          <Toaster />

        </ThemeProvider>
          
          </body>
      </html>
    </ClerkProvider> 
  );
}
