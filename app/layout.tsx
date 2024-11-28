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
import { AppDataProvider } from "@/context/AppDataContext";
import { PropsWithChildren } from "react";
import { Toaster } from "sonner";
import { RootProviders } from "./root-providers";

const fontSans = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Dashboard - Devio",
  description: "Dashboard",
};

interface Props {
  children: ReactNode;
}

export default async function RootLayout({ children }: PropsWithChildren<{}>) {
  const userResponse = await getUser();

  if (userResponse.status === "error" || !userResponse.data ) {
    if (
      typeof window !== "undefined" &&
      window.location.pathname !== "/login"
    ) {
      redirect("/login");
    }
  }

  const user = userResponse.data;

  const isLoginPage =
    typeof window !== "undefined" && window.location.pathname === "/login";

  if (isLoginPage) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body>{children}</body>
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
          <SessionProvider user={user ?? null}>
            <RootProviders>
              <AppDataProvider>
                <div className="w-full h-screen min-h-full overflow-hidden
                
                ">
                  {children}
                </div>
                <Toaster richColors />
              </AppDataProvider>
            </RootProviders>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
