'use client'
import { CardHome } from "@/components/home/CardHome"

export default function Page() {
  return (
    <div className="w-full h-screen min-h-full bg-background">
        <div className="w-full h-screen min-h-full flex justify-center items-center bg-primary">
            <CardHome />
        </div>
    </div>
  )
}