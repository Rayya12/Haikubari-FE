"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {Home,Feather,AlignLeft,GraduationCap,Settings, Icon} from "lucide-react"
import Image from "next/image";

const items = [
    {href:"/dashboard",label:"ホームページ",icon:Home},
    {href:"/dashboard/my-haiku",label:"自分の俳句",icon:Feather},
    {href:"/dashboard/all-haiku",label:"全部の俳句",icon:AlignLeft},
    {href:"/dashboard/learn",label:"俳句を学ぶ",icon:GraduationCap},
    {href:"/dashboard/settings",label:"プロファイル設定",icon:Settings},
]

export default function sidebarNav(){
    const pathname = usePathname();

    return(
        <aside className="bg-white h-screen w-70 border-r border-slate-200 shadow-md">
            {/** Header or Logo */}
            <div className="px-6 pt-8 pb-6">
                <Image src={"/blacklogo.png"} alt="俳句配りのロゴ" width={200} height={200}/>
            </div>
        </aside>
    )
}
