import { ReactNode } from "react";
import { getUser } from "@/actions/user";
import { redirect } from "next/navigation";
import { ResetPassword } from "@/components/login/reset-password";

interface Props {
  children: ReactNode;
}

export default async function Page({  }: Props) {

    return (
        <div className="w-full h-full flex items-center justify-center col-span-1 bg-secondary">
            <ResetPassword/>
        </div>
    );
  }