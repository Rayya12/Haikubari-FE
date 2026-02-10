import { streamText } from "ai"
import { google } from "@ai-sdk/google"

export const runtime = "edge" // bisa "nodejs" juga, tapi edge enak buat streaming

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: google("gemini-2.5-flash"), // ganti model sesuai kebutuhan
    messages,
    temperature: 0.7,
  })
  return result.toTextStreamResponse()
}
