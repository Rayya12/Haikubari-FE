"use client"
import HaikuList from "@/app/ui/HaikuList"
import Router from "next/navigation";

export default function myHaiku(){
    return(
    <div className="bg-white min-h-screen">
        <HaikuList />
    </div>
    )
}