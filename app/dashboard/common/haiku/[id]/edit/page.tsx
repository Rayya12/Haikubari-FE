"use client"

import { useParams } from "next/navigation"
import EditHaiku from "@/app/page/EditHaiku";

export default function EditHaikuPage(){
    const params = useParams<{id:string}>();
    return (
        <div className="min-h-screen bg-white w-full py-8">
            <EditHaiku id={params.id}></EditHaiku>
        </div>
    )
}