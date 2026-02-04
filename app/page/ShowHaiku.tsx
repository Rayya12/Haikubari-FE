"use client"
import { use, useEffect, useState } from "react";
import { getHaikuById } from "../lib/action"
import { Haiku } from "../lib/type";
import { ThumbsUp } from "lucide-react";
import { likes, unlikes,getIsLikes } from "../lib/action";


export default function ShowHaiku(props : {id:string}){
    const [haiku,setHaiku] = useState<Haiku|null>(null)
    const [err,setErr] = useState<string>("")
    const [loading,setLoading] = useState(false)
    const [more,setdescMore] = useState(false)
    const [isLikes,setIslike] = useState<Boolean>(false)

    useEffect(()=>{
        async function run() {
            setLoading(true)
            try{
                const data = await getHaikuById(props.id);
                const like = await getIsLikes(props.id);
                setHaiku(data)
                setIslike(like)
            }catch(e:any){
                setErr(e?.message ?? "failed to load")
            }finally{
                setLoading(false)
            }
        }
        run()
        
    },[props.id])

    const handleLike = async () => {
        try{
            const response = await likes(props?.id);
            setIslike(true)
        }catch(error:any){
            setErr(error?.message ?? "failed to likes")
        }
        
    }

    const handleUnlike = async () => {
        try{
            const response = await unlikes(props?.id);
            setIslike(false);
        }catch(error:any){
            setErr(error?.message ?? "failed to likes")
        }
    }

    
    return(
        <div className="flex flex-col pt-8 w-full items-center px-4">
            {loading && <div className="text-black text-2xl">
                ロード
                </div>}

            {  !loading &&  
                <div className="flex flex-col w-full items-center">
                <h1 className="flex p-4 bg-teal-Deer font-bold text-black justify-center text-2xl rounded-md w-full">{haiku?.title}</h1>
                <div className="flex flex-col border-2 border-slate-400 shadow-md rounded-md p-4 text-center mt-8 w-full">
                    <p className="font-bold text-2xl text-black mt-4 justify-center">{haiku?.hashigo}</p>
                    <p className="font-bold text-2xl text-black mt-4 justify-center">{haiku?.nakasichi}</p>
                    <p className="font-bold text-2xl text-black mt-4 justify-center mb-4">{haiku?.shimogo}</p>
                </div>

                <div className="flex flex-col border-2 border-slate-400 shadow-md p-4 mt-8 w-full">
                    <h2 className="text-xl text-black font-bold mb-2">解釈</h2>
                        {haiku?.description != null && haiku.description?.length < 30 && <p className="text-black">
                            {haiku.description}
                            </p>}

                        {haiku?.description != null && haiku.description?.length > 30 && !more && <p className="text-black">
                            {haiku?.description?.slice(0,30)}...
                            </p>}

                        {haiku?.description != null && haiku.description?.length > 30 && more && <p className="text-black">
                            {haiku?.description}
                            </p>}

                        {haiku?.description != null && haiku.description?.length > 30 && !more &&
                            <div className="flex justify-center">
                                <div className="flex rounded-md px-4 py-2 mt-4 hover:bg-slate-400 border border-black  text-black" onClick={()=>{setdescMore(true)}}>
                                    もっと見る
                                </div>
                            </div>
                        }

                        {haiku?.description != null && haiku.description?.length > 30 && more &&
                            <div className="flex justify-center">
                                <div className="flex rounded-md px-4 py-2 mt-4 hover:bg-slate-400 border border-black  text-black" onClick={()=>{setdescMore(false)}}>
                                    隠す
                                </div>
                            </div>
                        }
                </div>

                <div className="flex w-full justify-end mt-8">

                    {!isLikes && 
                    <button className="flex p-4 bg-white text-black font-bold rounded-md hover:shadow-md border border-slate-600 transition-colors" onClick={handleLike}>
                        🤍いいね
                    </button>
                    }

                    
                    {isLikes && 
                    <button className="flex p-4 text-black font-bold rounded-md hover:shadow-md bg-red-300 border border-red-600 transition-colors" onClick={handleUnlike}>
                        ❤️ いいね
                    </button>
                    }
                    
                    
                </div>

            </div>
            }
        </div>
    )
}