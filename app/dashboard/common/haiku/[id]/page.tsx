"use client"
import { useParams } from "next/navigation";
import ShowHaiku from "@/app/page/ShowHaiku"

export default function showHaiku(){
    const params = useParams<{id:string}>();
    return(
    <div className="min-h-screen bg-white w-full py-8">
        <ShowHaiku id={params.id} />
    </div>)
}