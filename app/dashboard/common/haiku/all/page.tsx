"use client"

import AllHaikuList from "@/app/ui/AllHaikuList"
import Router from "next/navigation";

export default function allHaiku(){
    return( 
    <div className="bg-white min-h-screen">
        <AllHaikuList />
    </div>
    )
}