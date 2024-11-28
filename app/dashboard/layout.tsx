import { getUser } from "@/actions/user";
import { HeaderNav } from "@/components/layout/header-nav";
import { SideBarMenu } from "@/components/layout/sidebar";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    const userResponse = await getUser();

    if (!userResponse || userResponse.status === "error" || !userResponse.data) {
        redirect("/login");
    }

    const user = userResponse.data;

    return (
        <div className="grid w-full h-full grid-cols-[300px_1fr]">
            <div className="flex w-full border-r pt-0 h-screen min-h-full">
                <SideBarMenu user={user} />
            </div>
            <div className="flex w-full flex-col h-screen min-h-full">
                <HeaderNav session={user} />
                <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}
