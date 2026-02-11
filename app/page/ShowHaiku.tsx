"use client"
import { use, useActionState, useEffect, useState } from "react";
import { getHaikuById } from "../lib/action"
import { Haiku,reviewResponse ,Review, userResponse} from "../lib/type";
import { ThumbsUp } from "lucide-react";
import { likes, unlikes,getIsLikes,getReview,createReview,handleDeleteHaiku} from "../lib/action";
import Form from "next/form";
import Link from "next/link";

const initialState = {error :undefined as string | undefined}

export default function ShowHaiku(props : {id:string}){
    const [haiku,setHaiku] = useState<Haiku|null>(null)
    const [err,setErr] = useState<string>("")
    const [loading,setLoading] = useState(false)
    const [more,setdescMore] = useState(false)
    const [isLikes,setIslike] = useState<Boolean>(false)
    const [numLikes,setNumLikes] = useState<Number>(0)
    const [reviewku, setReview] = useState<reviewResponse | null>(null)
    const [iscreate,setIsCreate] = useState<Boolean>(false)
    const [state,formAction] = useActionState(createReview as any,initialState)
    const [moreReview,setMoreReview] = useState<Boolean>(false)
    const [confirm,setConfirm] = useState<Boolean>(false)
    const [isMine,setIsMine] = useState<Boolean>(false)
    const [user, setUser] = useState<userResponse | null>(null)

    useEffect(()=>{
        async function run() {
            setLoading(true)
            try{
                const [data,like,reviewres] = await Promise.all([getHaikuById(props.id), getIsLikes(props.id),getReview(props.id)])    
                setHaiku(data.haiku)

                setIslike(like)
                setReview(reviewres)
                setNumLikes(data.haiku.likes)
                setIsMine(data.isMine)
                setUser(data.user)
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
            const [response,data] = await Promise.all([likes(props?.id),getHaikuById(props?.id)])
            setIslike(true)
            setNumLikes(data?.haiku.likes)

        }catch(error:any){
            setErr(error?.message ?? "failed to likes")
        }
        
    }

    const handleUnlike = async () => {
        try{
            const [response,data] = await Promise.all([unlikes(props?.id),getHaikuById(props?.id)])
            setIslike(false);
            setNumLikes(data?.haiku.likes);
        }catch(error:any){
            setErr(error?.message ?? "failed to likes")
        }
    }

    
    return(
        <div className="flex flex-col pt-8 w-full items-center px-4">

            {confirm && 
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-md p-6 w-[80%] max-w-sm shadow-lg">
                        <h2 className="text-lg font-bold text-black">
                            削除確認
                        </h2>

                        <p className="mt-2 text-sm text-gray-800">
                            本当にこの俳句を消すんですか？
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button className="text-black px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
                            onClick={()=>setConfirm(false)}>
                                キャンセル
                            </button>

                            <button className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700" onClick={()=> handleDeleteHaiku(props.id)}>
                                確認
                            </button>
                        </div>
                    </div>
                </div>
            }

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

                <div className="flex flex-col border-2 border-slate-400 shadow-md p-4 mt-8 w-full rounded-md">
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

                    {!isMine && (
                        <div className="flex flex-grow p-4 text-black font-bold border-2 border-slate-400 rounded-md items-center space-x-4">
                            <div className="flex w-10 h-10 rounded-full bg-cover bg-center shrink-0" style={{backgroundImage:`url(${user?.photo_url ?? "/loginBackground.png"})`}}></div>
                            <p>{user?.username}</p>
                        </div>)
                    }

                    <div className="flex p-4 text-black items-center">
                        いいね回数：{String(numLikes)}
                    </div>

                    {!isLikes && 
                    <button className="flex p-4 bg-white text-black font-bold rounded-md hover:shadow-md border border-slate-600 transition-colors items-center" onClick={handleLike}>
                        🤍いいね
                    </button>
                    }

                    
                    {isLikes && 
                    <button className="flex p-4 text-black font-bold rounded-md hover:shadow-md bg-red-300 border border-red-600 transition-colors items-center" onClick={handleUnlike}>
                        ❤️ いいね
                    </button>
                    }

                    { isMine &&
                    <button className="ml-2 flex p-4 text-white font-bold rounded-md hover:shadow-md bg-red-600" onClick={()=>{
                        setConfirm(true)
                    }}>
                        俳句を消す
                    </button>
                    }

                    { isMine && props.id &&
                    <Link href={`/dashboard/common/haiku/${props.id}/edit`} className="ml-2 flex p-4 text-white font-bold rounded-md hover:shadow-md bg-ateneo-blue">
                        俳句を編集する
                    </Link>
                    }




                    
                    
                </div>

                <div className="flex flex-col w-full p-4 mt-8 border-2 border-slate-400 shadow-md rounded-md">
                    <div className="flex font-bold text-white justify-between">
                        <h2 className="text-2xl text-black text-start font-bold ">レビュー</h2>
                        {!iscreate &&
                            <button className="bg-lime-green px-2 py-3 rounded-md transition-colors" onClick={()=>setIsCreate(true)}>レビューを作る</button>
                        }

                        {iscreate &&
                            <button className="bg-red-300 px-2 py-3 rounded-md transition-colors" onClick={()=>setIsCreate(false)}>作るのをやめる</button>
                        }  
                    </div>

                    {iscreate && 
                        <Form action={formAction}>
                            <input type="text" id="id" name="id" value={props.id} className="hidden" onChange={()=>""}/>
                            <label htmlFor="content" className="text-black">あなたのレビュー</label>
                            <div className="flex space-x-2">
                                <textarea id="content" name="content" className="flex w-7/8 h-24 text-black px-2 py-3 text-sm mt-1 border border-black rounded-md justify-items-start items-start text-start"/>
                                <button type="submit" className="flex flex-grow bg-ateneo-blue text-white px-2 py-3 font-bold rounded-md h-12 text-center justify-center">送信</button>
                            </div>     
                        </Form>
                    }
                    {
                        (reviewku == null || reviewku.reviews.length == 0) &&
                        <div className="flex h-12 w-full bg-gray-200 text-black font-bold items-center justify-center mt-8 rounded-md">
                            まだレビューがありません
                        </div>
                    }
                    
                    {reviewku != null && reviewku?.reviews.length <= 3 && reviewku?.reviews.map((review)=>{
                        return (
                        <div className="text-black px-1 py-2 border-1 border-slate-500 rounded-md mt-4" key={review.id}>
                            <p className="text-xs font-bold mb-1">{review.user.username}</p>
                            <p>{review.content}</p>
                        </div>)
                    })}

                    {reviewku != null && reviewku?.reviews.length > 3 && !moreReview && <div> {reviewku?.reviews.slice(0,3).map((review)=>{
                        return (
                        <div className="text-black px-1 py-2 border-1 border-slate-500 rounded-md mt-4" key={review.id}>
                            <p className="text-xs font-bold mb-1">レビューユーザーの名前</p>
                            <p>{review.content}</p>
                        </div>)
                    })
                
                    }
                        <div className="flex w-full justify-center mt-4">
                            <button className="flex px-2 py-3 border-2 border-slate-400 rounded-md shadow-md hover:bg-slate-300 text-black" onClick={()=>setMoreReview(true)}>もっと見る</button>
                        </div>
                    
                    </div>
                    }

                    {reviewku != null && reviewku?.reviews.length > 3 && moreReview && <div> {reviewku?.reviews.map((review)=>{
                        return (
                        <div className="text-black px-1 py-2 border-1 border-slate-500 rounded-md mt-4" key={review.id}>
                            <p className="text-xs font-bold mb-1">レビューユーザーの名前</p>
                            <p>{review.content}</p>
                        </div>)
                    })
                
                    }
                        <div className="flex w-full justify-center mt-4">
                            <button className="flex px-2 py-3 border-2 border-slate-400 rounded-md shadow-md hover:bg-slate-300 text-black" onClick={()=>setMoreReview(false)}>隠す</button>
                        </div>
                    
                    </div>
                    }


                    


                </div>

            </div>
            }
        </div>
    )
}