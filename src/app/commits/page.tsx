"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, GitCommit, ExternalLink, Loader2, Github } from "lucide-react"

interface Commit {
  sha: string
  message: string
  author_name: string | null
  author_email: string | null
  date_iso: string | null
  url: string
}

interface DayData {
  date: string
  count: number
  commits?: Commit[]
}

interface RepoCommitsData {
  per_day: DayData[]
  firstCommit: string | null
  lastCommit: string | null
}

interface RepoResult {
  name: string
  full_name: string
  html_url: string
  commitCount: number
}

interface RepoWithCommits extends RepoResult {
  commitsData?: RepoCommitsData
  loading?: boolean
}

export default function CommitsPage() {
  const [repos, setRepos] = useState<RepoWithCommits[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDay, setSelectedDay] = useState<{ repo: string; day: DayData } | null>(null)

  useEffect(() => {
    fetchTopRepos()
  }, [])

  const fetchTopRepos = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/top-repos?owner=shubhampawar4841")
      if (!response.ok) {
        throw new Error("Failed to fetch repositories")
      }
      const reposData: RepoResult[] = await response.json()
      
      // Initialize repos with loading state
      const reposWithLoading = reposData.map((repo) => ({
        ...repo,
        loading: false,
      }))
      setRepos(reposWithLoading)

      // Fetch commits for each repo
      for (const repo of reposData) {
        const [owner, repoName] = repo.full_name.split("/")
        await fetchRepoCommits(owner, repoName, repo.full_name)
      }
    } catch (err: any) {
      setError(err.message || "Failed to load repositories")
    } finally {
      setLoading(false)
    }
  }

  const fetchRepoCommits = async (owner: string, repo: string, fullName: string) => {
    setRepos((prev) =>
      prev.map((r) => (r.full_name === fullName ? { ...r, loading: true } : r))
    )

    try {
      const response = await fetch(`/api/repo-commits?owner=${owner}&repo=${repo}`)
      if (response.ok) {
        const data: RepoCommitsData = await response.json()
        setRepos((prev) =>
          prev.map((r) =>
            r.full_name === fullName ? { ...r, commitsData: data, loading: false } : r
          )
        )
      }
    } catch (err) {
      console.error(`Failed to load commits for ${fullName}:`, err)
      setRepos((prev) =>
        prev.map((r) => (r.full_name === fullName ? { ...r, loading: false } : r))
      )
    }
  }

  const getIntensity = (count: number) => {
    if (count === 0) return "bg-gray-900 border-gray-800"
    if (count < 3) return "bg-green-900/30 border-green-800/50"
    if (count < 6) return "bg-green-700/50 border-green-600/50"
    if (count < 10) return "bg-green-600/70 border-green-500/50"
    return "bg-green-500 border-green-400"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-400" />
          <p className="text-gray-400">Loading commits...</p>
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
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            GitHub Contributions
          </h1>
          <p className="text-gray-300">Commit activity heatmaps for top 5 repositories</p>
        </div>

        {/* Repos Heatmaps */}
        <div className="space-y-8">
          {repos.map((repo) => {
            const commitsData = repo.commitsData
            const maxCommitsInDay = commitsData?.per_day
              ? Math.max(...commitsData.per_day.map((d) => d.count), 0)
              : 0

            return (
              <Card
                key={repo.full_name}
                className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/30"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/20">
                        <Github className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-xl">{repo.name}</CardTitle>
                        <p className="text-sm text-gray-400 mt-1">{repo.full_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-400">
                        <span className="font-semibold text-white">{repo.commitCount.toLocaleString()}</span> total commits
                      </div>
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                  {commitsData?.firstCommit && commitsData?.lastCommit && (
                    <p className="text-sm text-gray-400 mt-2">
                      {new Date(commitsData.firstCommit).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      →{" "}
                      {new Date(commitsData.lastCommit).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  {repo.loading ? (
                    <div className="flex items-center justify-center h-64">
                      <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                    </div>
                  ) : commitsData?.per_day ? (
                    <>
                      <div className="overflow-x-auto mb-4">
                        <div
                          className="grid gap-1 p-4 bg-gray-900/50 rounded-lg min-w-max"
                          style={{ gridTemplateColumns: `repeat(${Math.min(commitsData.per_day.length, 53)}, minmax(8px, 1fr))` }}
                        >
                          {commitsData.per_day.map((day, idx) => (
                            <div
                              key={idx}
                              className={`aspect-square rounded border ${getIntensity(day.count)} cursor-pointer hover:scale-110 transition-transform relative group`}
                              onClick={() => setSelectedDay({ repo: repo.full_name, day })}
                              title={`${formatDate(day.date)}: ${day.count} commits`}
                            >
                              {day.count > 0 && (
                                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white opacity-0 group-hover:opacity-100">
                                  {day.count}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>Less</span>
                        <div className="flex gap-1">
                          <div className="w-3 h-3 rounded border bg-gray-900 border-gray-800"></div>
                          <div className="w-3 h-3 rounded border bg-green-900/30 border-green-800/50"></div>
                          <div className="w-3 h-3 rounded border bg-green-700/50 border-green-600/50"></div>
                          <div className="w-3 h-3 rounded border bg-green-600/70 border-green-500/50"></div>
                          <div className="w-3 h-3 rounded border bg-green-500 border-green-400"></div>
                        </div>
                        <span>More</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-gray-400 py-8">No commit data available</div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Selected Day Commits */}
        {selectedDay && selectedDay.day.count > 0 && (
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/30 mt-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">
                  {selectedDay.repo} - {formatDate(selectedDay.day.date)} - {selectedDay.day.count} commit
                  {selectedDay.day.count !== 1 ? "s" : ""}
                </CardTitle>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-gray-400 text-sm">
                Click on a day in the heatmap to see commit details
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function calculateStreak(perDay: DayData[]): number {
  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < perDay.length; i++) {
    const day = new Date(perDay[i].date)
    day.setHours(0, 0, 0, 0)
    const daysDiff = Math.floor((today.getTime() - day.getTime()) / (1000 * 60 * 60 * 24))

    if (daysDiff === i && perDay[i].count > 0) {
      streak++
    } else {
      break
    }
  }

  return streak
}

