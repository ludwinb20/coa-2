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
import { AppDataProvider } from '@/context/AppDataContext';
import { UserFront } from "@/types/users";
import { PropsWithChildren } from "react";

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

export default async function RootLayout({ children }: PropsWithChildren<{}>) {
  const userResponse = await getUser();

  console.log(userResponse.data);

  if (userResponse.status === 'error' || !userResponse.data) {
    if (typeof window !== "undefined" && window.location.pathname !== "/login") {
      redirect("/login");
    }
  }

  const user = userResponse.data;

  const isLoginPage = typeof window !== "undefined" && window.location.pathname === "/login";

  if (isLoginPage) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body>
          {children}
        </body>
      </html>
    );
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <SessionProvider user={user}>
            <AppDataProvider>
              <div className="w-full h-screen min-h-full overflow-hidden">
                <div className="grid w-full h-full grid-cols-[300px_1fr]">
                  <div className="flex w-full border-r pt-0 h-screen min-h-full">
                    <SideBarMenu user={user} />
                  </div>
                  <div className="flex w-full flex-col h-screen min-h-full">
                    <HeaderNav session={user} />
                    <main className="flex-1 overflow-y-auto">
                      {children}
                    </main>
                  </div>
                </div>
              </div>
            </AppDataProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
