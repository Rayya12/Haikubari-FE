import { streamText } from "ai"
import { google } from "@ai-sdk/google"

export const runtime = "edge" // bisa "nodejs" juga, tapi edge enak buat streaming

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: google("gemini-2.5-flash"), // ganti model sesuai kebutuhan
    messages,
    temperature: 0.7,
    system : "You are Master in haiku, you have fast amount of knowledge of haiku either it is traditional one or the modern one. Help the user to understand the haiku by answering their question. don't answer question that are not related in haiku at any cost (very strict about this) don't answer personal question, just giving advice about fact and structures of haiku"
  
  })
  return result.toTextStreamResponse()
}
