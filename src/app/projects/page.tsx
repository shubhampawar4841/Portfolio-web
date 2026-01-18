"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Github, Code } from "lucide-react"
import { projects } from "@/data/projects"

const categories = ["All", "Full Stack", "AI/ML"]

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState("All")

  const filteredProjects = selectedCategory === "All"
    ? projects
    : projects.filter(project => project.category === selectedCategory)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-b from-purple-950/20 to-black">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30">
              <Code className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">Projects</h1>
              <p className="text-gray-300 mt-2">A collection of my recent work and side projects</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Category Filter */}
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/30 mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    selectedCategory === category
                      ? "bg-purple-500/20 border-purple-500 text-white"
                      : "bg-white/5 border-white/10 text-gray-300 hover:border-purple-500/50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => {
            const Icon = project.icon
            return (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block h-full"
              >
                <Card
                  className={`bg-gradient-to-br ${project.color} border-2 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 group h-full flex flex-col cursor-pointer`}
                >
                <CardHeader>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2.5 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors border border-white/20 shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle className="text-white text-lg font-semibold">
                          {project.title}
                        </CardTitle>
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-white/10 text-gray-300 border border-white/10">
                        {project.category}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  {project.images && project.images.length > 0 && (
                    <div className="mb-4 rounded-lg overflow-hidden border border-white/10">
                      <Image
                        src={project.images[0]}
                        alt={project.title}
                        width={400}
                        height={200}
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardDescription className="text-gray-300 text-sm leading-relaxed mb-4 flex-1">
                    {project.description}
                  </CardDescription>
                  {project.features && project.features.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs text-gray-400 mb-2 font-semibold">Key Features:</div>
                      <div className="flex flex-wrap gap-2">
                        {project.features.map((feature, featureIndex) => (
                          <span
                            key={featureIndex}
                            className="px-2 py-1 rounded bg-emerald-500/20 text-xs text-emerald-300 border border-emerald-500/30"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="space-y-4">
                    {project.date && (
                      <div className="text-xs text-gray-400 mb-2">Date: {project.date}</div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 rounded bg-white/10 text-xs text-gray-300 border border-white/10"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        <Github className="w-4 h-4" />
                        Code
                      </a>
                      {project.demo !== "#" && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}


