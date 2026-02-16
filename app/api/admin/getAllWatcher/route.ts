import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL


export default async function GET(){
    const kukis = await cookies();
    const CToken = kukis.get("access_token")?.value

    if (!CToken) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const response = await fetch(`${BACKEND_URL}/users/watchers`,{
        method : "GET",
        headers : {
            "Content-Type" : "application/json"
        },
        cache : "no-store"
    })

    if (!response.ok){
        return new Response(JSON.stringify({message:"監視者のデータをロードできませんでした"}),{status:400}
        )
    }

    const data = await response.json()

    return Response.json(data);
}