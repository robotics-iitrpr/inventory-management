import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "@/components/Navbar";
import { Provider } from "@/components/ui/provider";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { Toaster } from "@/components/ui/toaster";
// import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inventory Management Portal",
  description: "BoST, IIT Ropar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-r from-pink-100 via-blue-100 to-purple-100`}
        >
          <Provider>
            <NavBar admin={process.env.ADMIN!}/>
            <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
            {children}
            <Toaster />
            {/* <Footer/> */}
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
