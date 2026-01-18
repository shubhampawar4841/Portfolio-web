"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { ExternalLink, Github, ArrowLeft, Code } from "lucide-react"
import { projects } from "@/data/projects"

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const project = projects.find((p) => p.id === projectId)

  if (!project) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <Link
            href="/projects"
            className="text-purple-400 hover:text-purple-300 underline"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    )
  }

  const Icon = project.icon

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-b from-purple-950/20 to-black">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30">
              <Code className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">{project.title}</h1>
              <p className="text-gray-300 mt-2">{project.category} • {project.date}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images Carousel */}
          <div className="lg:col-span-2">
            {project.images && project.images.length > 0 ? (
              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/30">
                <CardContent className="pt-6">
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    className="w-full"
                  >
                    <CarouselContent>
                      {project.images.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="p-1">
                            <Card className="bg-black/50 border-white/10">
                              <CardContent className="flex items-center justify-center p-0 aspect-video">
                                <Image
                                  src={image}
                                  alt={`${project.title} - Image ${index + 1}`}
                                  width={1200}
                                  height={675}
                                  className="w-full h-full object-contain rounded-lg"
                                  priority={index === 0}
                                />
                              </CardContent>
                            </Card>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {project.images.length > 1 && (
                      <>
                        <CarouselPrevious className="left-2 md:left-4" />
                        <CarouselNext className="right-2 md:right-4" />
                      </>
                    )}
                  </Carousel>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center h-64 text-gray-400">
                    No images available
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Project Details */}
          <div className="space-y-6">
            {/* Project Info Card */}
            <Card className={`bg-gradient-to-br ${project.color} border-2`}>
              <CardHeader>
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2.5 rounded-lg bg-white/10 border border-white/20 shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-white text-xl font-semibold mb-2">
                      {project.title}
                    </CardTitle>
                    <span className="text-xs px-2 py-1 rounded bg-white/10 text-gray-300 border border-white/10">
                      {project.category}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-sm leading-relaxed mb-4">
                  {project.description}
                </CardDescription>
                
                {project.date && (
                  <div className="text-xs text-gray-400 mb-4">Date: {project.date}</div>
                )}

                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    <Github className="w-4 h-4" />
                    View Code
                  </a>
                  {project.demo !== "#" && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Features Card */}
            {project.features && project.features.length > 0 && (
              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-lg font-semibold">Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.features.map((feature, featureIndex) => (
                      <span
                        key={featureIndex}
                        className="px-3 py-1.5 rounded bg-emerald-500/20 text-sm text-emerald-300 border border-emerald-500/30"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tech Stack Card */}
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white text-lg font-semibold">Tech Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1.5 rounded bg-white/10 text-sm text-gray-300 border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

