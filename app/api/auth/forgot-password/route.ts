const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export async function POST(request: Request) {
    const { email } = await request.json()

    const response = await fetch(`${BACKEND_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    })

    if (!response.ok) {
        return new Response(
            JSON.stringify({ error: "エラーが発生しましたしばらくお待ちください。" }),
            { status: 400 }
        )
    }

    return Response.json({ success: true })
}
