import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL


export async function PATCH(request: Request){

    const {id,email,status}  = await request.json();
    const kukis = await cookies();
    const CToken = kukis.get("access_token")?.value

    if (!CToken) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const response = await fetch(`${BACKEND_URL}/users/watchers/changeStatus`,{
        method : "PATCH",
        headers : {
            "Content-Type" : "application/json",
            Authorization : `Bearer ${CToken}`
        },
        body:JSON.stringify({id:id,email:email,status:status})
    })

    if (!response.ok){
        return new Response(JSON.stringify({message:"監視者のデータをロードできませんでした"}),{status:400}
        )
    }
    const data = await response.json()
    return Response.json(data);
}