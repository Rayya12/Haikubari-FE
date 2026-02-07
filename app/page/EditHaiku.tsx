'use client'

import Form from "next/form"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useActionState } from "react"
import { getHaikuById, handleCreateHaiku } from "../lib/action"
import { useSearchParams } from "next/navigation"

const initialState = {
    error: undefined as string | undefined
}

export default function EditHaiku(props : {id:string}){


    const [loading,setLoading] = useState<Boolean>(false)
    const [err,setErr] = useState<string|null>(null)
    const [title,setTitle] = useState('')
    const [line1,setLine1] = useState('')
    const [line2,setLine2] = useState('')
    const [line3,setLine3] = useState('')
    const [description,setDescription] = useState('')
    const [state,formAction] = useActionState(handleCreateHaiku,initialState)

    const handleChangeTitle = (e:any) => {
        const title = e.target.value
        if (title.length <= 15){
            setTitle(e.target.value)
        }
    }

    const handleChangeLine1 = (e:any) => {
        const line1 = e.target.value
        if (line1.length <= 5){
            setLine1(e.target.value)
        }
    }

    const handleChangeLine2 = (e:any) => {
        const line2 = e.target.value
        if (line2.length <= 7){
            setLine2(e.target.value)
        }
    }

    const handleChangeLine3 = (e:any) => {
        const line3 = e.target.value
        if (line3.length <= 5){
            setLine3(e.target.value)
        }
    }

    const handleChangeDescription = (e:any) => {
        const description = e.target.value
        if (description.length <= 300){
            setDescription(e.target.value)
        }
    }

    useEffect(
        ()=>{
            let cancelled = false;
            async function run() {
                setLoading(true)
                setErr(null)
                if (props.id){
                    try {
                        const data = await getHaikuById(props.id);
                        if (!cancelled){
                            setTitle(data.haiku.title)
                            setLine1(data.haiku.hashigo)
                            setLine2(data.haiku.nakasichi)
                            setLine3(data.haiku.shimogo)
                            if (data.haiku.description){
                                setDescription(data.haiku.description)
                            }
                        }
                    }catch(e:any){
                        if (!cancelled){
                            setErr("俳句をフェッチするのをぢ来ませんでした")
                        }
                    }finally{
                        if (!cancelled) setLoading(false)
                    }
                }else{
                    setErr("俳句をのIDが見つかりません")
                }
                
            }
            run()
            return ()=> {
                    cancelled = true
            }
            
        },[props.id]
    )

    return (<div className="min-h-screen flex flex-col bg-white p-4">

        {loading && (
            <div className="flex justify-center items-center mt-8 text-black text-2xl font-bold">
                ロード
            </div>
        )}

        { !loading && (
        <div className="mt-20 space-y-4">
        <h1 className="block text-4xl font-bold text-center text-ateneo-blue">俳句の編集</h1>
        <div className="flex justify-center">
        {state.error && (
            <div className="w-full max-w-lg bg-red-300 p-2 rounded-md border border-red-700 text-red-950 mt-2">
              {state.error as string}
            </div>
          )}
        </div>
        <Form action={formAction} className="flex items-center justify-center">
            <div className="w-full max-w-lg">
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-ateneo-blue">タイトル</label>
                    <input type="text" id="title" name="title" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black" value={title} onChange={handleChangeTitle}/>
                </div>
                <div className="mb-4">
                    <label htmlFor="line1" className="block text-sm font-medium text-ateneo-blue">上五</label>
                    <input type="text" id="line1" name="line1" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black" value={line1} onChange={handleChangeLine1}/>
                </div>
                <div className="mb-4">
                    <label htmlFor="line2" className="block text-sm font-medium text-ateneo-blue">中七</label>
                    <input type="text" id="line2" name="line2" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black" value={line2} onChange={handleChangeLine2}/>
                </div>
                <div className="mb-4">
                    <label htmlFor="line3" className="block text-sm font-medium text-ateneo-blue">下五</label>
                    <input type="text" id="line3" name="line3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black" value={line3} onChange={handleChangeLine3}/>
                </div>

                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-ateneo-blue">俳句の説明</label>
                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
                        value={description}
                        onChange={handleChangeDescription}/>
                </div>
                <div className="flex w-full justify-end space-x-2">
                    <Link href={"/dashboard/common/haiku/mine"} className="w-1/4 bg-ateneo-blue hover:ring-2 ring-lime-green text-white font-bold py-2 px-4 rounded text-center">戻ります</Link>
                    <button type="submit" className="w-1/4 bg-lime-green hover:ring-2 ring-ateneo-blue text-white font-bold py-2 px-4 rounded text-center">俳句を更新</button>
                </div>
                
            </div>

        </Form>

          </div>)}
    </div>)
}