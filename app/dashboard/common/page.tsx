'use client'
import Image from "next/image"
import Link from "next/link"


export default function homePage(){
    return(
    <div className="flex min-h-screen w-full bg-cover bg-center justify-center" style={{backgroundImage:(`url(/backgroundHome.png)`)}}>
        <div className="flex flex-col-reverse md:flex-row gap-4 justify-center items-center md:justify-center">

            <div className="flex flex-col">
                <div className="text-5xl text-ateneo-blue font-bold">
                    今を大切に<br/>
                    俳句を作ろう
                 </div>

                 <div className="flex space-x-4 mt-8">
                    <Link href={"/dashboard/common/haiku/mine/create"} className="px-3 py-2 border border-lime-green rounded-md text-lime-green  text-xl hover:bg-slate-100">俳句を作る</Link>
                    <Link href={"/dashboard/common/haiku/mine/create"} className="px-3 py-2 bg-ateneo-blue rounded-md text-white text-xl hover:bg-gray-800">俳句を学ぶ</Link>
                </div>

            </div>

            

            

            <Image src={"/HaikubariMan.png"} alt="俳句張りのヒーロー画面" height={350} width={300}></Image>

            
        </div>
    </div>)
}