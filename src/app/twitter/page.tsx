"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Twitter, Heart, MessageCircle, Repeat2, Share2, Bookmark, Eye, RefreshCw, Send, Bot, User, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Tweet {
  id: string
  text: string
  language: string
  type: string
  authorName: string
  authorUsername: string
  viewCount: number
  replyCount: number
  retweetCount: number
  quoteCount: number
  favoriteCount: number
  bookmarkCount: number
  createdAt: string
  tweetUrl: string
  source: string
  hashtags: string[]
  urls: string
  mediaType: string
  mediaUrls: string[]
}

export default function TwitterPage() {
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content: "Hi! I can help you learn more about Shubham's coding journey. Ask me about any tweet, specific day, technologies, or projects mentioned!",
    },
  ])
  const [chatInput, setChatInput] = useState("")
  const [chatLoading, setChatLoading] = useState(false)
  const chatMessagesEndRef = useRef<HTMLDivElement>(null)

  const fetchTweets = async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch only 365 days of coding tweets
      const response = await fetch('/api/twitter?count=20&type=all&codingJourney=true')
      if (!response.ok) {
        throw new Error('Failed to fetch tweets')
      }
      const data = await response.json()
      setTweets(data.tweets || [])
    } catch (err: any) {
      setError(err.message || 'Failed to load tweets')
      console.error('Error fetching tweets:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTweets()
  }, [])

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diff = now.getTime() - date.getTime()
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      
      if (days === 0) return 'Today'
      if (days === 1) return 'Yesterday'
      if (days < 7) return `${days}d ago`
      if (days < 30) return `${Math.floor(days / 7)}w ago`
      if (days < 365) return `${Math.floor(days / 30)}mo ago`
      return `${Math.floor(days / 365)}y ago`
    } catch {
      return dateString
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const scrollChatToBottom = () => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollChatToBottom()
  }, [chatMessages])

  const handleChatSend = async () => {
    if (!chatInput.trim() || chatLoading) return

    const userMessage = chatInput.trim()
    setChatInput("")
    setChatMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setChatLoading(true)

    try {
      // Prepare comprehensive tweets data for context
      const tweetsContext = tweets.map((tweet) => {
        const dayNumber = extractDayNumber(tweet.text)
        return {
          id: tweet.id,
          text: tweet.text,
          dayNumber: dayNumber,
          hashtags: tweet.hashtags,
          createdAt: tweet.createdAt,
          mediaType: tweet.mediaType,
          viewCount: tweet.viewCount,
          replyCount: tweet.replyCount,
          retweetCount: tweet.retweetCount,
          favoriteCount: tweet.favoriteCount,
        }
      })

      // Build conversation messages
      const conversationMessages = [
        ...chatMessages.slice(1).map((msg) => ({
          role: msg.role === "user" ? ("user" as const) : ("assistant" as const),
          content: msg.content,
        })),
        {
          role: "user" as const,
          content: userMessage,
        },
      ]

      // Call Twitter chat API
      const response = await fetch("/api/twitter/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          messages: conversationMessages,
          tweets: tweetsContext,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get response")
      }

      const data = await response.json()
      const text = data.text || "Sorry, I couldn't generate a response."

      setChatMessages((prev) => [...prev, { role: "assistant", content: text }])
    } catch (error: any) {
      console.error("Chat Error:", error)
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ])
    } finally {
      setChatLoading(false)
    }
  }

  const extractDayNumber = (text: string): string | null => {
    const match = text.match(/(?:📅\s*)?Day\s+(\d+)(?:\/(\d+))?/i)
    if (match) {
      return match[1] // Return the day number
    }
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading tweets...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="p-8 bg-card border-border">
              <p className="text-destructive mb-4">{error}</p>
              <button
                onClick={fetchTweets}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/20 border border-primary/30">
              <Twitter className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">365 Days of Coding</h1>
              <p className="text-muted-foreground mt-1">My coding journey - Day by day progress</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 border border-primary/30 text-foreground hover:bg-primary/30 transition-colors"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden md:inline">{chatOpen ? "Close Chat" : "Ask AI"}</span>
            </button>
            <button
              onClick={fetchTweets}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 border border-primary/30 text-foreground hover:bg-primary/30 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden md:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Chat Sidebar */}
        {chatOpen && (
          <div className="fixed right-4 top-20 bottom-4 w-full max-w-md z-50 md:block hidden">
            <Card className="h-full flex flex-col bg-card border-border shadow-xl">
              <CardHeader className="border-b border-border flex-shrink-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Bot className="w-5 h-5 text-primary" />
                    Ask About Tweets
                  </CardTitle>
                  <button
                    onClick={() => setChatOpen(false)}
                    className="p-1 rounded-lg hover:bg-muted transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
                <div className="flex-1 space-y-4">
                  {chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                          <Bot className="w-5 h-5 text-primary" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === "user"
                            ? "bg-primary/20 text-foreground"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                      </div>
                      {message.role === "user" && (
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                      )}
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <Bot className="w-5 h-5 text-primary" />
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatMessagesEndRef} />
                </div>
                <div className="border-t border-border pt-4 flex-shrink-0">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleChatSend()}
                      placeholder="Ask about any tweet, day, or technology..."
                      className="flex-1 px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-sm"
                      disabled={chatLoading}
                    />
                    <button
                      onClick={handleChatSend}
                      disabled={chatLoading || !chatInput.trim()}
                      className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Mobile Chat Modal */}
        {chatOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setChatOpen(false)} />
            <Card className="absolute inset-x-4 top-20 bottom-4 flex flex-col bg-card border-border shadow-xl">
              <CardHeader className="border-b border-border flex-shrink-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Bot className="w-5 h-5 text-primary" />
                    Ask About Tweets
                  </CardTitle>
                  <button
                    onClick={() => setChatOpen(false)}
                    className="p-1 rounded-lg hover:bg-muted transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
                <div className="flex-1 space-y-4">
                  {chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                          <Bot className="w-5 h-5 text-primary" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === "user"
                            ? "bg-primary/20 text-foreground"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                      </div>
                      {message.role === "user" && (
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                      )}
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <Bot className="w-5 h-5 text-primary" />
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatMessagesEndRef} />
                </div>
                <div className="border-t border-border pt-4 flex-shrink-0">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleChatSend()}
                      placeholder="Ask about any tweet, day, or technology..."
                      className="flex-1 px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-sm"
                      disabled={chatLoading}
                    />
                    <button
                      onClick={handleChatSend}
                      disabled={chatLoading || !chatInput.trim()}
                      className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tweets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tweets.map((tweet) => {
            const dayNumber = extractDayNumber(tweet.text)
            return (
            <Card key={tweet.id} className="bg-card border-border hover:border-primary/50 transition-colors">
              <div className="p-6">
                {/* Day Badge */}
                {dayNumber && (
                  <div className="mb-4">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 text-primary font-bold text-lg">
                      📅 Day {dayNumber}
                    </span>
                  </div>
                )}
                
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                    <Twitter className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">{tweet.authorName}</h3>
                      <span className="text-muted-foreground text-sm">@{tweet.authorUsername}</span>
                      {tweet.type !== 'Tweet' && (
                        <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                          {tweet.type}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{formatDate(tweet.createdAt)}</p>
                  </div>
                </div>

                {/* Tweet Text */}
                <div className="mb-4">
                  <p className="text-foreground whitespace-pre-wrap break-words leading-relaxed">
                    {tweet.text}
                  </p>
                </div>

                {/* Hashtags */}
                {tweet.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tweet.hashtags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Media */}
                {tweet.mediaUrls.length > 0 && (() => {
                  // Filter out emoji URLs on frontend as safety measure
                  const validMediaUrls = tweet.mediaUrls.filter(url => 
                    url && 
                    !url.includes('/emoji/') && 
                    !url.includes('abs-0.twimg.com/emoji')
                  )
                  
                  if (validMediaUrls.length === 0) return null
                  
                  // Check if URLs are video thumbnails (show as images)
                  const isVideoThumbnail = (url: string) => {
                    return url.includes('ext_tw_video_thumb') || url.includes('amplify_video') || url.includes('tweet_video_thumb')
                  }
                  
                  // Convert all media to images (since we only have thumbnails, not actual video URLs)
                  const showAsImages = validMediaUrls.some(url => isVideoThumbnail(url)) || tweet.mediaType === 'photo'
                  
                  return (
                    <div className="mb-4 rounded-lg overflow-hidden border border-border">
                      {showAsImages ? (
                        <div className={validMediaUrls.length === 1 ? "" : "grid grid-cols-2 gap-1"}>
                          {validMediaUrls.slice(0, 4).map((url, idx) => (
                            <div 
                              key={idx} 
                              className={`relative ${validMediaUrls.length === 1 ? 'aspect-video' : 'aspect-square'} bg-muted`}
                            >
                              <Image
                                src={url}
                                alt={`Tweet media ${idx + 1}`}
                                fill
                                className="object-cover"
                                unoptimized
                                onError={(e) => {
                                  // Fallback: try removing name parameter or using original URL
                                  const target = e.target as HTMLImageElement
                                  const fallbackUrl = url.replace(/[?&]name=[^&]*/g, '')
                                  if (fallbackUrl !== url) {
                                    target.src = fallbackUrl
                                  }
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="relative aspect-video bg-muted">
                          <video
                            src={validMediaUrls[0]}
                            controls
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // If video fails, try to show thumbnail as image
                              console.error('Video failed to load:', validMediaUrls[0])
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )
                })()}

                {/* Engagement Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{formatNumber(tweet.replyCount)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Repeat2 className="w-4 h-4" />
                      <span>{formatNumber(tweet.retweetCount)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{formatNumber(tweet.favoriteCount)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{formatNumber(tweet.viewCount)}</span>
                    </div>
                  </div>
                  {tweet.tweetUrl && (
                    <Link
                      href={tweet.tweetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            </Card>
            )
          })}
        </div>

        {tweets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tweets found. Try refreshing.</p>
          </div>
        )}
      </div>
    </div>
  )
}

