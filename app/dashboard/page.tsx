import { redirect } from "next/navigation";
import {GET} from "@/app/api/users/me/route"

type User = {
    role:"common" | "watcher" | "admin",
}

export default async function dashboard(){
    const res = await GET();
    if (!res.ok){
        redirect("/login")
    }
    const user:User = await res.json();
    if (user.role == "common"){redirect("/dashboard/common")}
    if (user.role == "watcher"){redirect("/dashboard/watcher")}
    redirect("/dashboard/admin")
}