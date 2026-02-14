import { redirect } from "next/navigation"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export async function POST(request: Request) {
    const {token,password} = await request.json()

    const response = await fetch(`${BACKEND_URL}/auth/forgot-password`,{
        method : "POST",
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({token,password})
    })

    if (!response.ok){
        return new Response(JSON.stringify({error : "トークンが間違いました"}))
    }

    return Response.json({success : true})


}