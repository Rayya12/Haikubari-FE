'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2 } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatbotUI() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      if (!response.ok) throw new Error('Failed to fetch')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''

      // Add empty assistant message that we'll update
      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        
        // Parse berbagai format streaming yang mungkin
        const lines = chunk.split('\n').filter(line => line.trim() !== '')
        
        for (const line of lines) {
          // Format 1: "0:text"
          if (line.startsWith('0:')) {
            const content = line.slice(2).replace(/^"|"$/g, '')
            assistantMessage += content
          }
          // Format 2: plain text (untuk beberapa versi Vercel AI SDK)
          else if (!line.startsWith('data:') && !line.startsWith('{')) {
            assistantMessage += line
          }
          // Format 3: data: {...}
          else if (line.startsWith('data:')) {
            try {
              const jsonStr = line.slice(5).trim()
              if (jsonStr && jsonStr !== '[DONE]') {
                const data = JSON.parse(jsonStr)
                if (data.choices?.[0]?.delta?.content) {
                  assistantMessage += data.choices[0].delta.content
                } else if (typeof data === 'string') {
                  assistantMessage += data
                }
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
        
        // Update the last message with accumulated content
        setMessages(prev => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: assistantMessage,
          }
          return newMessages
        })
      }

      // Jika tidak ada content sama sekali, tampilkan error
      if (!assistantMessage.trim()) {
        setMessages(prev => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: 'No response received. Please try again.',
          }
          return newMessages
        })
      }

    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => {
        // Remove empty assistant message if exists
        const filtered = prev.filter(m => m.content !== '')
        return [
          ...filtered,
          {
            role: 'assistant',
            content: 'Sorry, something went wrong. Please try again.',
          },
        ]
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="bg-ateneo-blue p-2 rounded-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-800">俳句AI</h1>
            <p className="text-sm text-slate-500">俳句について何でもお聞きください</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <Bot className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <h2 className="text-2xl font-semibold text-slate-700 mb-2">
                俳句AI
              </h2>
              <p className="text-slate-500">
                俳句について何でもお聞きください
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="bg-ateneo-blue p-2 rounded-lg h-fit">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              
              <div
                className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-lime-green text-white'
                    : 'bg-white text-ateneo-blue shadow-sm border border-slate-200'
                }`}
              >
                <p className="whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              </div>

              {message.role === 'user' && (
                <div className="bg-ateneo-blue p-2 rounded-lg h-fit">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex gap-3 justify-start">
              <div className="bg-ateneo-blue p-2 rounded-lg h-fit">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-slate-200">
                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-slate-200 px-4 py-4 shadow-lg">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 bg-slate-100 rounded-2xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
                placeholder="メッセージを入力してください..."
                rows={1}
                className="w-full px-4 py-3 bg-transparent resize-none outline-none text-slate-800 placeholder:text-slate-400 max-h-32"
                style={{
                  minHeight: '24px',
                  height: 'auto',
                }}
                
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-lime-green text-white p-3 rounded-xl hover:bg-ateneo-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">
            エンターで送信、シフト✙エンターで新しい文
          </p>
        </form>
      </div>
    </div>
  )
}
