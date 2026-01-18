"use client"

import Link from "next/link"
import Image from "next/image"
import { useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Code,
  Briefcase,
  Mail,
  Github,
  Linkedin,
  Twitter,
  ArrowRight,
  Sparkles,
  Trophy,
  Play,
} from "lucide-react"

const stats = [
  { label: "LeetCode Problems", value: "500+", icon: Code },
  { label: "GeeksforGeeks Rating", value: "1872", icon: Briefcase },
  { label: "DSA Problems Solved", value: "200+", icon: Sparkles },
  { label: "GitHub Repos", value: "50+", icon: Github },
]

function TimelapseVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      // Ensure video plays and loops
      video.play().catch((error) => {
        console.log("Autoplay prevented:", error)
      })
      
      // Handle video end to ensure looping
      const handleEnded = () => {
        video.currentTime = 0
        video.play().catch(() => {})
      }
      
      video.addEventListener('ended', handleEnded)
      
      return () => {
        video.removeEventListener('ended', handleEnded)
      }
    }
  }, [])

  return (
    <video
      ref={videoRef}
      className="w-full h-full object-cover"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
    >
      <source src="/timelapse/1000038037.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  )
}

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Hero Section */}
      <div className="border-b border-border bg-gradient-to-b from-purple-950/20 to-background relative">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left side - Text content */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-6">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-purple-300">Available for new projects</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Shubham Pawar
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                  Full Stack Engineer | AI-Powered Applications | Next.js & React Specialist
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8">
                  <Link
                    href="/projects"
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition-transform flex items-center gap-2"
                  >
                    View Projects
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="px-6 py-3 rounded-lg bg-secondary border border-border text-foreground font-semibold hover:bg-accent transition-colors"
                  >
                    Get In Touch
                  </Link>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-6">
                  <a href="https://github.com/shubhampawar4841" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Github className="w-6 h-6" />
                  </a>
                  <a href="https://linkedin.com/in/shubhampawar4841" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Linkedin className="w-6 h-6" />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Twitter className="w-6 h-6" />
                  </a>
                  <a href="mailto:shubhampawar4036@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Mail className="w-6 h-6" />
                  </a>
                </div>
              </div>
              
              {/* Right side - Profile Photo */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative w-full max-w-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl"></div>
                  <div className="relative rounded-2xl overflow-hidden border-2 border-purple-500/30">
                    <Image
                      src="/ho1ahmm4JcF_xw3qQEC9J_c8a50b4f2b7d4f9eb38c2abebfdf682b (1).jpg"
                      alt="Shubham Pawar"
                      width={400}
                      height={500}
                      className="w-full h-auto object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="bg-card border-border">
                <CardContent className="pt-6 text-center">
                  <Icon className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Timelapse Section */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-600/20 border border-pink-500/30 shadow-lg">
              <Play className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Work Timelapse</h2>
          </div>
          <Card className="bg-card border-border overflow-hidden">
            <CardContent className="p-0">
              <div className="relative w-full aspect-video bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                <TimelapseVideo />
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent pointer-events-none"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* About Section */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30 shadow-lg">
              <Code className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">About Me</h2>
          </div>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Full Stack Engineer skilled in Next.js, React, Angular, TypeScript, JavaScript, Express, and Prisma. 
                  Experienced in AI-powered applications, AI agents, and web scraping technologies. Constantly improving my coding skills 
                  and expanding my portfolio by sharing my work online.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Currently working as a Software Developer Intern at Finora AI, developing AI-driven SaaS platforms for 
                  investment advisors. Previously interned at Raava (San Francisco) as a Full Stack Developer, where I built 
                  AI-powered applications and worked extensively with AI agents using React Native, Cursor AI, Firecrawls, 
                  Voice Agents, and Character AI Browser.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  I have hands-on experience developing and integrating AI agents into production applications, creating intelligent 
                  voice interfaces, and building character-based AI browser experiences. My work with AI agents has involved 
                  real-time data processing, natural language understanding, and creating seamless user interactions.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Passionate about solving complex problems, I've achieved 4-Star Coder status on GeeksforGeeks (1872 rating) 
                  and ranked in top 20% of LeetCode users with 500+ solved problems. I maintain 300+ days of consistent 
                  technical content creation on Twitter.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 shadow-lg">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Achievements</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* LeetCode Achievement */}
            <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/30 hover:scale-[1.02] transition-all group">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-orange-500/20 border border-orange-500/30">
                    <Code className="w-5 h-5 text-orange-400" />
                  </div>
                  <CardTitle className="text-foreground">LeetCode</CardTitle>
                </div>
                <CardDescription className="text-muted-foreground">
                  500+ Problems Solved
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border bg-muted">
                  <Image
                    src="/brave_9U6ZlkjXEu.png"
                    alt="LeetCode 500 Problems Solved"
                    width={400}
                    height={200}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    priority
                  />
                </div>
              </CardContent>
            </Card>

            {/* GitHub Achievement */}
            <Card className="bg-gradient-to-br from-gray-500/10 to-gray-600/10 border-gray-500/30 hover:scale-[1.02] transition-all group">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-gray-500/20 border border-gray-500/30">
                    <Github className="w-5 h-5 text-gray-400" />
                  </div>
                  <CardTitle className="text-foreground">GitHub</CardTitle>
                </div>
                <CardDescription className="text-muted-foreground">
                  Active Contributor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border bg-muted">
                  <Image
                    src="/chrome_C3fGN3MXx3.png"
                    alt="GitHub Profile"
                    width={400}
                    height={200}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    priority
                  />
                </div>
              </CardContent>
            </Card>

            {/* Twitter Achievement */}
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/30 hover:scale-[1.02] transition-all group">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
                    <Twitter className="w-5 h-5 text-blue-400" />
                  </div>
                  <CardTitle className="text-foreground">Twitter</CardTitle>
                </div>
                <CardDescription className="text-muted-foreground">
                  365 Days Streak
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
                  <Image
                    src="/brave_ooTodrZRVM.png"
                    alt="Twitter 365 Days Streak"
                    width={400}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <Card className="bg-card border-border">
          <CardContent className="pt-12 pb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Let's Work Together</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition-transform"
            >
              Get In Touch
              <ArrowRight className="w-4 h-4" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 Portfolio. Built with Next.js & Tailwind CSS</p>
        </div>
      </footer>
    </div>
  )
}
