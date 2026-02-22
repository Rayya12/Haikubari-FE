'use client'
import { useSearchParams } from "next/navigation"
import Form from "next/form"
import { ChangeEvent, useActionState, useState } from "react" 
import { handleVerifyOTP } from "../lib/action"
import { stat } from "fs"


const initialState = {
    error:undefined as string | undefined
}

export default function VerifOTP() {
    const [state,formAction] = useActionState(handleVerifyOTP,initialState);

    const searchParams = useSearchParams()
    const email = "halo@gmail.com"//searchParams.get("email")

    const [one,setOne] = useState("")
    const [two,setTwo] = useState("")
    const [three,setThree] = useState("")
    const [four,setFour] = useState("")
    const [five,setFive] = useState("")
    const [six,setSix] = useState("")

    const handleOne = (e:React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value)
        if (!isNaN(value) && (value>=0) && (value<=9)){
            setOne(value.toString())
        }
        
    }

    const handleTwo = (e:React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value)
        if (!isNaN(value) && (value>=0) && (value<=9)){
            setTwo(value.toString())
        }
        
    }

    const handleThree = (e:React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value)
        if (!isNaN(value) && (value>=0) && (value<=9)){
            setThree(value.toString())
        }
        
    }

    const handleFour = (e:React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value)
        if (!isNaN(value) && (value>=0) && (value<=9)){
            setFour(value.toString())
        }
        
    }

    const handleFive = (e:React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value)
        if (!isNaN(value) && (value>=0) && (value<=9)){
            setFive(value.toString())
        }
        
    }

    const handleSix = (e:React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value)
        if (!isNaN(value) && (value>=0) && (value<=9)){
            setSix(value.toString())
        }
        
    }



  return (

    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: 'url(/loginBackground.png)' }}
    >
      <div className="flex flex-col w-full sm:w-3/4 lg:w-1/2 bg-white shadow-md rounded-md border border-gray-300 items-center justify-center px-4 py-8 space-y-4">
        <p className="text-black font-bold text-2xl text-center">OTPを<i>{"***"+email.slice(3)}</i>にておくしましたそうしんした<br/>OTPをこちらでいれてください</p>
        <Form action={formAction} className="flex flex-col space-y-2 items-center justify-center">
            <div className="flex space-x-2 w-full items-center justify-center pt-4">
            <input type="text" min={1} required id="one" name="one" className="p-2 border border-black text-black w-1/7 text-center rounded-md" value={one} onChange={handleOne}/>
            <input type="text" min={1} required id="two" name="two"className="p-2 border border-black text-black  w-1/7 text-center rounded-md" value={two} onChange={handleTwo}/>
            <input type="text" min={1} required id="three" name="three" className="p-2 border border-black text-black  w-1/7 text-center rounded-md" value={three} onChange={handleThree}/>
            <input type="text" min={1} required id="four" name="four" className="p-2 border border-black text-black w-1/7 text-center rounded-md" value={four} onChange={handleFour}/>
            <input type="text" min={1} required id="five" name="five" className="p-2 border border-black text-black w-1/7 text-center rounded-md" value={five} onChange={handleFive}/>
            <input type="text" min={1} required id="six" name="six" className="p-2 border border-black text-black  w-1/7 text-center rounded-md" value={six} onChange={handleSix}/>
            </div>
            {state.error && (
            <div className="flex w-3/4 items-center justify-center bg-red-300 border-red-700 text-red-950 rounded-md p-2 mt-2">{state.error}</div>
        )}

        <button type="submit" className="flex items-center justify-center p-2 bg-lime-green rounded-md shadow-md font-bold w-3/4 mt-4 text-xl hover:ring-2 hover:ring-ateneo-blue">確認</button>
        </Form>
        
      </div>

      

      
    </div>
  )
}
