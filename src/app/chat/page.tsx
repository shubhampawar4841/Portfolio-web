"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, Bot, User } from "lucide-react"

const SYSTEM_CONTEXT = `
You are Shubham Pawar. You are not an assistant — you are speaking directly to the visitor on your portfolio.

Talk like a real human:
- Short sentences  
- Casual tone  
- No long paragraphs  
- No robotic explanations  
- Keep it natural, friendly, and confident  

Don't say you're an AI.  
Don't write in third person.  
Always speak as "I" and "me."

Here’s what you (Shubham) know about yourself:

Full Stack Engineer experienced in:
React, Next.js, Angular, TypeScript, Tailwind, Material UI  
Node, Express, REST APIs, Clerk, JWT  
MongoDB, PostgreSQL, Firebase, Prisma, Supabase  
AI tools: Cursor AI, Firecrawl, voice agents  
Cloud: GitHub, Cloudflare Workers, Vercel  

Experience:
- Software Developer Intern @ Finora AI  
- Full Stack Developer Intern @ Raava, San Francisco  

Projects:
Medium Clone, Finora platform, AI tools, voice agents  

Achievements:
4-Star GFG, Top 20% LeetCode, 500+ problems, 365+ days of tech content  
CN Rank 81, GFG Rank 33  

Education:
B.E. in Electronics & Computer Engineering, VIT Mumbai  

Your style:
- Keep answers short (1–3 sentences)  
- Sound real, like you're chatting  
- Be helpful but not overly formal  

Your goal is to help visitors get to know you in a natural, human way.
`;



export default function ChatPage() {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content: "Hello! I'm an AI assistant for Shubham Pawar's portfolio. I can help you learn about his skills, experience, projects, achievements, and answer questions about his work as a Full Stack Engineer. What would you like to know?",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setLoading(true)

    try {
      // Build conversation messages with system context
      const conversationMessages = [
        {
          role: "system" as const,
          content: SYSTEM_CONTEXT,
        },
        ...messages.slice(1).map((msg) => ({
          role: msg.role === "user" ? ("user" as const) : ("assistant" as const),
          content: msg.content,
        })),
        {
          role: "user" as const,
          content: userMessage,
        },
      ]

      // Call our Next.js API route (server-side)
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: conversationMessages }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get response")
      }

      const data = await response.json()
      const text = data.text || "Sorry, I couldn't generate a response."

      setMessages((prev) => [...prev, { role: "assistant", content: text }])
    } catch (error: any) {
      console.error("Error:", error)

      let errorMessage = "Sorry, something went wrong. Please try again."

      if (error?.message?.includes("401") || error?.message?.includes("403")) {
        errorMessage = "API key error. Please check your configuration."
      }

      setMessages((prev) => [...prev, { role: "assistant", content: errorMessage }])
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Portfolio Chat Assistant
          </h1>
          <p className="text-gray-300">Ask me anything about Shubham's skills, experience, projects, and achievements</p>
        </div>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/30 h-[calc(100vh-250px)] flex flex-col">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="text-white">Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-purple-400" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-purple-500/20 text-white"
                      : "bg-white/5 text-gray-200"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-blue-400" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-purple-400" />
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>
          <div className="border-t border-white/10 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="Ask about skills, experience, projects, achievements..."
                className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="px-6 py-3 rounded-lg bg-purple-500 hover:bg-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

