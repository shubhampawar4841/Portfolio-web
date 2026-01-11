"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Github, GitBranch, Calendar, ExternalLink, Loader2, Star, GitCommit } from "lucide-react"
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface Commit {
  sha: string
  message: string
  author_name: string | null
  date: string | null
  url: string
}

interface RepoResult {
  name: string
  full_name: string
  html_url: string
  commitCount: number
  recentCommits: Commit[]
}

interface ChartData {
  date: string
  commits: number
}

interface RepoCommitsData {
  per_day: ChartData[]
  firstCommit: string | null
  lastCommit: string | null
}

const chartConfig = {
  commits: {
    label: "Commits",
    color: "rgb(168, 85, 247)",
  },
} satisfies ChartConfig

export default function ReposPage() {
  const [repos, setRepos] = useState<RepoResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedRepo, setExpandedRepo] = useState<string | null>(null)
  const [repoCharts, setRepoCharts] = useState<Record<string, RepoCommitsData>>({})
  const [loadingCharts, setLoadingCharts] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetchTopRepos()
  }, [])

  // Auto-fetch charts when repos are loaded
  useEffect(() => {
    if (repos.length > 0) {
      repos.forEach((repo) => {
        const [owner, repoName] = repo.full_name.split("/")
        // Fetch chart data for each repo
        fetchRepoCommits(owner, repoName)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repos.length])

  const fetchTopRepos = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/top-repos?owner=shubhampawar4841")
      if (!response.ok) {
        throw new Error("Failed to fetch repositories")
      }
      const data = await response.json()
      setRepos(data)
    } catch (err: any) {
      setError(err.message || "Failed to load repositories")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Unknown date"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const truncateMessage = (message: string, maxLength: number = 80) => {
    if (message.length <= maxLength) return message
    return message.slice(0, maxLength) + "..."
  }

  const fetchRepoCommits = async (owner: string, repo: string) => {
    const key = `${owner}/${repo}`
    if (repoCharts[key]) return // Already loaded

    setLoadingCharts((prev) => ({ ...prev, [key]: true }))
    try {
      const response = await fetch(`/api/repo-commits?owner=${owner}&repo=${repo}`)
      if (response.ok) {
        const data = await response.json()
        setRepoCharts((prev) => ({ ...prev, [key]: data }))
      }
    } catch (err) {
      console.error(`Failed to load commits for ${key}:`, err)
    } finally {
      setLoadingCharts((prev) => ({ ...prev, [key]: false }))
    }
  }

  const handleToggleCommits = (repoFullName: string) => {
    setExpandedRepo(expandedRepo === repoFullName ? null : repoFullName)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-400" />
          <p className="text-gray-400">Loading top repositories...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/10 border-red-500/30 max-w-md">
          <CardContent className="p-6">
            <p className="text-red-400">Error: {error}</p>
            <button
              onClick={fetchTopRepos}
              className="mt-4 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
            >
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Top Repositories
          </h1>
          <p className="text-gray-300">Most active repositories by commit count</p>
        </div>

        {/* Repos List */}
        <div className="space-y-6">
          {repos.length === 0 ? (
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/30">
              <CardContent className="p-6 text-center">
                <p className="text-gray-400">No repositories found</p>
              </CardContent>
            </Card>
          ) : (
            repos.map((repo, index) => (
              <Card
                key={repo.full_name}
                className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/30 hover:border-purple-400/50 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-purple-500/20">
                          <Github className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-xl">{repo.name}</CardTitle>
                          <p className="text-sm text-gray-400 mt-1">{repo.full_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 mt-4">
                        <div className="flex items-center gap-2 text-gray-400">
                          <GitCommit className="w-4 h-4" />
                          <span className="text-sm">{repo.commitCount.toLocaleString()} commits</span>
                        </div>
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          <span className="text-sm">View on GitHub</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-6">
                    {/* Contribution Chart - Show Directly */}
                    <div>
                      {loadingCharts[repo.full_name] ? (
                        <div className="flex items-center justify-center h-64">
                          <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                        </div>
                      ) : repoCharts[repo.full_name]?.per_day ? (
                        <Card className="bg-black/50 border-white/10">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-white text-lg">Commit Timeline</CardTitle>
                              {repoCharts[repo.full_name].firstCommit && repoCharts[repo.full_name].lastCommit && (
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                      {new Date(repoCharts[repo.full_name].firstCommit!).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </span>
                                  </div>
                                  <span>→</span>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                      {new Date(repoCharts[repo.full_name].lastCommit!).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                            <CardDescription className="text-gray-400">
                              Showing all commits from first commit to last commit
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-4">
                            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                              <LineChart
                                accessibilityLayer
                                data={repoCharts[repo.full_name].per_day}
                                margin={{
                                  top: 20,
                                  left: 12,
                                  right: 12,
                                  bottom: 12,
                                }}
                              >
                                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis
                                  dataKey="date"
                                  tickLine={false}
                                  axisLine={false}
                                  tickMargin={8}
                                  minTickGap={Math.max(20, Math.floor(repoCharts[repo.full_name].per_day.length / 10))}
                                  tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                                  angle={-45}
                                  textAnchor="end"
                                  height={60}
                                  tickFormatter={(value) => {
                                    const date = new Date(value)
                                    return date.toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                    })
                                  }}
                                />
                                <ChartTooltip
                                  cursor={false}
                                  content={
                                    <ChartTooltipContent
                                      indicator="line"
                                      className="bg-black border-white/20 text-white"
                                      labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                        })
                                      }}
                                    />
                                  }
                                />
                                <Line
                                  dataKey="commits"
                                  type="natural"
                                  stroke="rgb(168, 85, 247)"
                                  strokeWidth={2}
                                  dot={{
                                    fill: "rgb(168, 85, 247)",
                                  }}
                                  activeDot={{
                                    r: 6,
                                  }}
                                >
                                  <LabelList
                                    position="top"
                                    offset={12}
                                    className="fill-foreground"
                                    fontSize={12}
                                  />
                                </Line>
                              </LineChart>
                            </ChartContainer>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="text-center text-gray-400 py-8 bg-white/5 rounded-lg">
                          Loading chart data...
                        </div>
                      )}
                    </div>

                    {/* Recent Commits - Dropdown */}
                    {repo.recentCommits.length > 0 && (
                      <div>
                        <button
                          onClick={() => handleToggleCommits(repo.full_name)}
                          className="w-full flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors mb-4"
                        >
                          <span className="text-sm font-medium text-gray-300">
                            Recent Commits ({repo.recentCommits.length})
                          </span>
                          <GitBranch
                            className={`w-4 h-4 text-gray-400 transition-transform ${
                              expandedRepo === repo.full_name ? "rotate-90" : ""
                            }`}
                          />
                        </button>

                        {expandedRepo === repo.full_name && (
                          <div className="space-y-3">
                            {repo.recentCommits.map((commit) => (
                              <div
                                key={commit.sha}
                                className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-purple-500/50 transition-colors"
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <p className="text-white mb-2">{truncateMessage(commit.message)}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                      {commit.author_name && (
                                        <div className="flex items-center gap-2">
                                          <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                                            <span className="text-xs text-purple-400">
                                              {commit.author_name.charAt(0).toUpperCase()}
                                            </span>
                                          </div>
                                          <span>{commit.author_name}</span>
                                        </div>
                                      )}
                                      {commit.date && (
                                        <div className="flex items-center gap-2">
                                          <Calendar className="w-4 h-4" />
                                          <span>{formatDate(commit.date)}</span>
                                        </div>
                                      )}
                                      <span className="text-xs font-mono text-gray-500">{commit.sha.slice(0, 7)}</span>
                                    </div>
                                  </div>
                                  <a
                                    href={commit.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-purple-400 hover:text-purple-300 transition-colors shrink-0"
                                  >
                                    <ExternalLink className="w-5 h-5" />
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

