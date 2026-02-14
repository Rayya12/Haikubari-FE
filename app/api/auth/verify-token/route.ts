
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export async function POST(request: Request) {
    const {token,password} = await request.json()

    const response = await fetch(`${BACKEND_URL}/auth/reset-password`,{
        method : "POST",
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({"token":String(token),"password":String(password)})
    })

    if (!response.ok){
        return new Response(JSON.stringify({error : "トークンが間違いました"}),{status:400})
    }

    return Response.json({success : true})


}