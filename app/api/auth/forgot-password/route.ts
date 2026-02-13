import { redirect } from "next/navigation"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export async function POST(request: Request) {
    const {email} = await request.json()

    const response = await fetch(`${BACKEND_URL}/auth/forgot-password`,{
        method : "POST",
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({email})
    })

    if (!response.ok){
        throw Error("エラーが発生しましたしばらくお待ちください。")
    }

    redirect(`/verify-token?email=${email}`)


}