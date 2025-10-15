import "@/styles/globals.css";
import { Metadata } from "next";
import clsx from "clsx";
import { SessionProvider } from "next-auth/react";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/toaster";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,

  icons: {
    icon: "/ecclessia.png",
    shortcut: "/ecclessia.png",
    apple: "/ecclessia.png",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html suppressHydrationWarning lang="fr">
      <head />
      <body
        className={clsx(
          "min-h-screen  bg-transparent font-sans antialiased",
          fontSans.variable,
        )}
      >
        {/* {pathname === "prayer-wall" && <div className="background-prayer-wall" />} */}

        <SessionProvider session={session}>
          <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
            <div className="relative flex flex-col h-full bg-transparent">
              {children}
            </div>
            <Toaster />
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
