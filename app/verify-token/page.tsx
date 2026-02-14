'use client'
import { useSearchParams } from "next/navigation"
import { ChangeEvent, useActionState, useState } from "react" 


export default function VerifOTP() {
    const searchParams = useSearchParams()

    const [loading,setLoading] = useState(false)
    const [token,seToken] = useState("")
    const [error,setError] = useState<string  | null>(null)
    const [password,setPassword] = useState("")
    const [passwordConfirm,setPasswordConfirm] = useState("")

    const email = searchParams.get("email") ?? ""

    const handleToken = (e:React.ChangeEvent<HTMLInputElement>) => {
        seToken(e.target.value)
    }

    const handlePassword = (e:React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    const handleConfirmPassword = (e:React.ChangeEvent<HTMLInputElement>) => {
        setPasswordConfirm(e.target.value)
    }

    const handleTokenInput = async (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        const passwordRegex = /^.{8,12}$/;

        if (!password){
            setError("パスワード入れてください")
            return
        }
        if (!passwordRegex.test(password) ) {
            setError("パスワードの長さは8ー12文字")
            return
        }

        if (!passwordConfirm){
            setError("パスワード確認を入れてください")
            return
        }

        if (!passwordRegex.test(passwordConfirm) ) {
            setError("パスワード確認の長さは8ー12文字")
            return
        }

        if (password !== passwordConfirm){
            setError("パスワードとパスワード確認が違います")
            return
        }


        try {
            setLoading(true)
            const response = await fetch('/api/auth/verify-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body : JSON.stringify({token,password})})
        }catch (e:any){
            setError("トークンが間違いました")
        }finally{
            setLoading(false)
        }
    }



  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: 'url(/loginBackground.png)' }}
    >
      <div className="flex flex-col w-full sm:w-3/4 lg:w-1/2 bg-white shadow-md rounded-md border border-gray-300 items-center justify-center px-4 py-8 space-y-4">
        <p className="text-black font-bold text-2xl text-center">OTPを<i>{"***"+email.slice(3)}</i>にておくしましたそうしんした<br/>OTPをこちらでいれてください</p>
        
            <div className="flex flex-col w-full items-center pt-4">
                <div className="flex justify-start w-3/4">
                    <label htmlFor="token" className="font-bold">トークン</label>
                </div>
                <input type="text" required id="token" name="token" className="flex p-2 border border-black text-black w-3/4 rounded-md" value={token} onChange={handleToken}/>


                <div className="flex justify-start w-3/4 mt-2">
                    <label htmlFor="password" className="font-bold">パスワード</label>
                </div>
                <input type="text" required id="password" name="password" className="flex p-2 border border-black text-black w-3/4 rounded-md" value={password} onChange={handlePassword}/>

                <div className="flex justify-start w-3/4 mt-2">
                    <label htmlFor="passwordC" className="font-bold">パスワード確認</label>
                </div>
                <input type="text" required id="passwordC" name="passwordC" className="flex p-2 border border-black text-black w-3/4 rounded-md" value={passwordConfirm} onChange={handleConfirmPassword}/>
                </div>
                {error && (
                <div className="flex w-3/4 items-center justify-center bg-red-300 border-red-700 text-red-950 rounded-md p-2 mt-2">{error}</div>
        )}

        <button className={`flex items-center justify-center p-2 bg-lime-green rounded-md shadow-md font-bold w-3/4 mt-4 text-xl hover:ring-2 hover:ring-ateneo-blue text-white ${loading ? ` bg-gray-500` : `bg-lime-green`}`} onClick={handleTokenInput}>確認</button>
        
      </div>

      

      
    </div>
  )
}
