"use client"

import Image from "next/image";
import Form from 'next/form'
import Link from "next/link";
import { useActionState } from "react";
import { handleLogin } from "../lib/action";
import { useState } from "react";


const initialState = {
    error : undefined as string | undefined
}

export default function LoginPage(){

    const [state,formAction] = useActionState(handleLogin,initialState)
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

   
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center space-y-4" style={{backgroundImage:"url(/loginBackground.png)"}}>
                <Image src="/blacklogo.png" alt="Haikubari Logo" width={500} height={500}></Image>
                <div className="flex justify-center lg:w-1/3 sm:w-full space-x-4 p-4 border border-gray-300 rounded-lg shadow-lg">
                    <Form className="flex flex-col w-full items-center justify-center space-y-3" action={formAction}>
                        <div className="flex text-black text-left font-bold w-3/4">
                            <label htmlFor="email" >メール</label>
                        </div>
                        <input type="email" name="email" id="email" className="w-3/4 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ateneo-blue text-black" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                        <div className="flex text-black text-left w-3/4 font-bold">
                            <label htmlFor="password">パスワード</label>
                        </div>
                        <input type="password" name="password" id="password" className="w-3/4 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ateneo-blue text-black" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                        {state.error && (
            <div className="w-3/4 bg-red-300 p-2 rounded-md border border-red-700 text-red-950 mt-2">
              {state.error as string}
            </div>
          )}
                        <button className="bg-lime-green text-white p-4 rounded-md shadow-md w-3/4 mt-4 mb-4 hover:ring-2 hover:ring-teal" type="submit">
                            ログイン
                        </button>

                        
                        <Link className="text-ateneo-blue hover:font-bold" href={"/register"}>アカウントお持ちしない場合</Link>
                        <Link className="text-ateneo-blue hover:font-bold" href={"/forgot-password"}>パスワードをお忘れの方</Link>
                
                    </Form>
                </div>
        </div>
    )
}