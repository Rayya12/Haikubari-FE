"use client"
import HaikuList from "@/app/ui/HaikuList"
import Router from "next/navigation";
import { Suspense } from "react";

export default function myHaiku(){
    return(
    <Suspense fallback = {<div>Loading...</div>}>
        <div className="bg-white min-h-screen">
            <HaikuList />
        </div>
    </Suspense>
    )
}