import { HeaderNav } from "@/components/layout/header-nav";
import { Metadata } from "next";
import React, { ReactNode } from "react";
import { SideBarMenu } from "@/components/layout/sidebar";
import { getUser } from "@/actions/user";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import { Inter, Figtree } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "./session-provider";
import { ThemeProvider } from "./theme-provider";

const fontSans = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Dashboard - Iobot",
  description: "Dashboard",
};

interface Props {
  children: ReactNode;
}

export default async function RootLayout({ children }: Props) {
  const user = await getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <SessionProvider user={user.data}>
          <div className="w-full h-screen min-h-full overflow-hidden">
            <div className="grid w-full h-full grid-cols-[300px_1fr]">
              <div className="flex w-full border-r pt-0 h-screen min-h-full">
                <SideBarMenu user={user.data} />
              </div>
              <div className="flex w-full flex-col h-screen min-h-full">
                <HeaderNav session={user.data} />
                <ThemeProvider
                  attribute="class"
                  defaultTheme="dark"
                  disableTransitionOnChange
                >
                  {children}
                </ThemeProvider>
              </div>
            </div>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
