declare module "ai/react" {
  import * as React from "react"

  type ChatStatus = "idle" | "submitted" | "streaming"
  type Message = any

  export function useChat(): {
    messages: Message[]
    input: string
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    handleSubmit: (e?: React.FormEvent) => void | Promise<void>
    status: ChatStatus
    stop: () => void
  }

  export default useChat
}