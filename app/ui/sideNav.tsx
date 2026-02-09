"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {Home,Feather,AlignLeft,GraduationCap,Settings,LogOut} from "lucide-react"
import Image from "next/image";
import clsx from "clsx";
import { handleLogout } from "@/app/lib/action";

const items = [
    {href:"/dashboard/common",label:"ホームページ",icon:Home},
    {href:"/dashboard/common/haiku/mine",label:"自分の俳句",icon:Feather},
    {href:"/dashboard/common/haiku/all",label:"全部の俳句",icon:AlignLeft},
    {href:"/dashboard/common/learn",label:"俳句を学ぶ",icon:GraduationCap},
    {href:"/dashboard/common/settings",label:"プロファイル設定",icon:Settings},
]

export default function SidebarNav(){
    const pathname = usePathname();

    return(
<aside className="bg-white min-h-screen w-[280px] border-r border-slate-200 shadow-md p-4 flex flex-col sticky top-0">
  {/* Logo */}
  <div className="pt-8 pb-6">
    <Image src="/blacklogo.png" alt="俳句配りのロゴ" width={300} height={300} />
  </div>

  {/* Navigation */}
  <nav className="px-2 flex flex-col flex-grow">
    <ul className="space-y-3">
      {items.map((it) => {
        const active =
          pathname === it.href

        const Icon = it.icon

        return (
          <li key={it.href}>
            <Link
              href={it.href}
              className={clsx(
                "group relative flex w-full items-center gap-3 rounded-md px-4 py-3 transition-colors",
                active
                  ? "bg-lime-green text-white shadow-sm"
                  : "text-lime-green hover:bg-slate-100"
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={2.2} />
              <span className="text-lg font-bold tracking-tight">
                {it.label}
              </span>
            </Link>
          </li>
        )
      })}
    </ul>

    {/* Logout */}
    <div className="mt-auto pt-6 mb-4">
      <button className="w-full flex items-center gap-3 rounded-md bg-red-400 px-4 py-3 text-white font-bold hover:bg-red-500 transition-colors" onClick={handleLogout}>
        <LogOut className="h-5 w-5" strokeWidth={2.2} />
        ログアウト
      </button>
    </div>
  </nav>
</aside>
    )
}