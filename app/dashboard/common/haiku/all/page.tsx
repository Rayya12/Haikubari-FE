"use client"

import AllHaikuList from "@/app/ui/AllHaikuList"
import Router from "next/navigation";
import { Suspense } from "react";

export default function allHaiku(){
    return( 
    <Suspense fallback = {<div>Loading...</div>}>
        <div className="bg-white min-h-screen">
            <AllHaikuList />
        </div>
    </Suspense>
    )
}