"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Calendar, MapPin, Building2 } from "lucide-react"

const experiences = [
  {
    title: "Software Developer Intern",
    company: "Finora AI",
    location: "Remote",
    period: "March 2025 - Present",
    type: "Internship",
    color: "from-purple-500/20 to-purple-600/20 border-purple-500/30",
    description: "Developing AI-driven SaaS platform for investment advisors using TypeScript, Next.js, and Supabase with RBAC/RLS implementation. Building interactive trade timeline with 100% data accuracy and data visualization dashboards.",
    achievements: [
      "Built interactive trade timeline (entry/stop-loss/targets) with 100% data accuracy using shadcn/ui",
      "Implemented secure Clerk authentication and role-based data access controls (RBAC) with row-level security (RLS) policies",
      "Created data visualization dashboards featuring P/L indicators and risk/reward ratios using Recharts",
      "Reduced UI load time via skeleton loaders and optimized API calls with selective stock data filtering",
      "Designed responsive UI components with Lucide icons and implemented proper state transition constraints",
    ],
    tech: ["Next.js", "TypeScript", "Supabase", "Clerk", "Recharts", "shadcn/ui", "PostgreSQL"],
  },
  {
    title: "Full Stack Developer Intern",
    company: "Raava",
    location: "San Francisco, USA (Remote)",
    period: "June 2024 - Present",
    type: "Internship",
    color: "from-cyan-500/20 to-cyan-600/20 border-cyan-500/30",
    description: "Developed AI-powered applications using React Native and Cursor AI for enhanced development efficiency. Implemented web scraping solutions and built voice agent interfaces using cutting-edge AI technologies.",
    achievements: [
      "Developed AI-powered applications using React Native and Cursor AI for enhanced development efficiency",
      "Implemented web scraping solutions with Firecrawls to collect and process large-scale web data",
      "Built voice agent interfaces and character AI browser experiences using cutting-edge AI technologies",
      "Optimized Node.js backend services for handling real-time data processing from various AI sources",
      "Collaborated with US-based team to implement responsive UI components for cross-platform compatibility",
    ],
    tech: ["React Native", "Cursor AI", "Firecrawls", "Voice Agents", "Character AI Browser", "Node.js"],
  },
]

const education = [
  {
    degree: "Bachelor of Engineering in Electronics and Computer Engineering",
    school: "Vidyalankar Institute Of Technology",
    location: "Mumbai, Maharashtra",
    period: "2021 - 2025",
    color: "from-pink-500/20 to-pink-600/20 border-pink-500/30",
    description: "CGPA: 7.5/10. Relevant Coursework: Data Structures, Algorithms, Database Management. Currently pursuing degree with focus on software engineering and computer systems.",
  },
]

const achievements = [
  {
    title: "4-Star Coder on GeeksforGeeks",
    description: "Achieved 4-Star Coder status with 1872 rating points, solving 200+ DSA problems",
    color: "from-green-500/20 to-green-600/20 border-green-500/30",
  },
  {
    title: "Top 20% LeetCode User",
    description: "Ranked in top 20% of LeetCode users with 500+ solved problems across various difficulty levels",
    color: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
  },
  {
    title: "Coding Contest Achievements",
    description: "Rank 81 in Coding Ninjas Weekly Contest 127 | Rank 33 in GeeksforGeeks Weekly Contest 156",
    color: "from-yellow-500/20 to-yellow-600/20 border-yellow-500/30",
  },
  {
    title: "Content Creation",
    description: "Maintained 300+ days of consistent technical content creation on Twitter",
    color: "from-purple-500/20 to-purple-600/20 border-purple-500/30",
  },
]

export default function ExperiencePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-b from-purple-950/20 to-black">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">Experience</h1>
              <p className="text-gray-300 mt-2">My professional journey and career milestones</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Work Experience */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Building2 className="w-6 h-6 text-purple-400" />
            Work Experience
          </h2>
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <Card key={index} className={`bg-gradient-to-br ${exp.color} border-2 hover:scale-[1.01] transition-all`}>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-white text-2xl mb-2">{exp.title}</CardTitle>
                      <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-3">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          <span className="font-semibold">{exp.company}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{exp.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{exp.period}</span>
                        </div>
                      </div>
                      <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs text-gray-300 border border-white/10">
                        {exp.type}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-gray-300 text-base leading-relaxed">
                    {exp.description}
                  </CardDescription>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Key Achievements:</h4>
                    <ul className="space-y-2">
                      {exp.achievements.map((achievement, aIndex) => (
                        <li key={aIndex} className="text-gray-300 text-sm flex items-start gap-2">
                          <span className="text-purple-400 mt-1">•</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {exp.tech.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 rounded bg-white/10 text-xs text-gray-300 border border-white/10"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Briefcase className="w-6 h-6 text-purple-400" />
            Education
          </h2>
          <div className="space-y-6">
            {education.map((edu, index) => (
              <Card key={index} className={`bg-gradient-to-br ${edu.color} border-2 hover:scale-[1.01] transition-all`}>
                <CardHeader>
                  <CardTitle className="text-white text-2xl mb-2">{edu.degree}</CardTitle>
                  <div className="flex flex-wrap items-center gap-4 text-gray-300">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span className="font-semibold">{edu.school}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{edu.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{edu.period}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-base leading-relaxed">
                    {edu.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Professional Achievements */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Briefcase className="w-6 h-6 text-purple-400" />
            Professional Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className={`bg-gradient-to-br ${achievement.color} border-2 hover:scale-[1.01] transition-all`}>
                <CardHeader>
                  <CardTitle className="text-white text-xl mb-2">{achievement.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-sm leading-relaxed">
                    {achievement.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


