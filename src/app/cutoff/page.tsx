"use client"

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Search, Loader2, FileText, GraduationCap, BookOpen } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface CutoffData {
  college_code: string
  college_name: string
  course_code: string
  course_name: string
  seat_type: string
  category: string
  rank: number
  percentile: number
}

interface FilterOptions {
  colleges: Array<{ code: string; name: string }>
  courses: Array<{ code: string; name: string }>
  categories: string[]
  seatTypes: string[]
}

// Memoized table row component
const TableRow = ({ row }: { row: CutoffData }) => (
  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
    <td className="px-6 py-4">
      <div className="flex items-center gap-2">
        <GraduationCap className="w-4 h-4 text-purple-400 flex-shrink-0" />
        <div>
          <div className="font-medium text-white">{row.college_name}</div>
          <div className="text-xs text-gray-500">Code: {row.college_code}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-pink-400 flex-shrink-0" />
        <div>
          <div className="font-medium text-white">{row.course_name}</div>
          <div className="text-xs text-gray-500">Code: {row.course_code}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-300 text-xs font-medium">
        {row.category}
      </span>
    </td>
    <td className="px-6 py-4 text-right font-mono text-gray-300">{row.rank.toLocaleString()}</td>
    <td className="px-6 py-4 text-right font-mono text-purple-400 font-semibold">
      {row.percentile.toFixed(2)}
    </td>
  </tr>
)

export default function CutoffPage() {
  const [data, setData] = useState<CutoffData[]>([])
  const [loading, setLoading] = useState(true)
  const [parsing, setParsing] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    colleges: [],
    courses: [],
    categories: [],
    seatTypes: []
  })
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [minPercentile, setMinPercentile] = useState('')
  const [maxPercentile, setMaxPercentile] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        search: debouncedSearch,
        course: selectedCourse,
        category: selectedCategory,
        page: page.toString(),
        limit: '50'
      })
      if (minPercentile) params.append('minPercentile', minPercentile)
      if (maxPercentile) params.append('maxPercentile', maxPercentile)

      const response = await fetch(`/api/cutoff/data?${params}`)
      const result = await response.json()

      if (response.ok) {
        setData(result.data)
        setFilters(result.filters)
        setTotalPages(result.totalPages)
        setTotal(result.total)
      } else {
        console.error('Failed to fetch data:', result.error)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, selectedCourse, selectedCategory, minPercentile, maxPercentile, page])

  const parsePDF = async () => {
    try {
      setParsing(true)
      const response = await fetch('/api/cutoff/parse', {
        method: 'POST'
      })
      const result = await response.json()

      if (response.ok) {
        alert('PDF parsed successfully! Refreshing data...')
        await fetchData()
      } else {
        alert(`Failed to parse PDF: ${result.error}`)
      }
    } catch (error: any) {
      alert(`Error parsing PDF: ${error.message}`)
    } finally {
      setParsing(false)
    }
  }

  // Fetch data when filters change
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, selectedCourse, selectedCategory, minPercentile, maxPercentile])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Limit filter options for performance
  const limitedCourses = useMemo(() => {
    return filters.courses.slice(0, 500) // Limit to first 500 courses
  }, [filters.courses])

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                MHT-CET Cutoff 2022
              </h1>
              <p className="text-gray-300">College admission cutoff data for engineering courses</p>
            </div>
            <button
              onClick={parsePDF}
              disabled={parsing}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {parsing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Parsing...</span>
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  <span>Parse PDF</span>
                </>
              )}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/30">
              <CardHeader className="pb-2">
                <CardDescription className="text-gray-400">Total Records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{total.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/30">
              <CardHeader className="pb-2">
                <CardDescription className="text-gray-400">Colleges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filters.colleges.length}</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/30">
              <CardHeader className="pb-2">
                <CardDescription className="text-gray-400">Courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filters.courses.length}</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/30">
              <CardHeader className="pb-2">
                <CardDescription className="text-gray-400">Categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filters.categories.length}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/30 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by college or course name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Filters Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                {/* Course Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Course</label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                  >
                    <option value="">All Courses</option>
                    {limitedCourses.map((course) => (
                      <option key={course.code} value={course.code}>
                        {course.code} - {course.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                  >
                    <option value="">All Categories</option>
                    {filters.categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Min Percentile */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Min Percentile</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={minPercentile}
                    onChange={(e) => setMinPercentile(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                {/* Max Percentile */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Percentile</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={maxPercentile}
                    onChange={(e) => setMaxPercentile(e.target.value)}
                    placeholder="100.00"
                    className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        ) : data.length === 0 ? (
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/30">
            <CardContent className="py-20 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-500" />
              <p className="text-gray-400 mb-4">No data found. Please parse the PDF first.</p>
              <button
                onClick={parsePDF}
                disabled={parsing}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
              >
                Parse PDF
              </button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/30">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">College</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Course</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Category</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Rank</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Percentile</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, index) => (
                        <TableRow key={`${row.college_code}-${row.course_code}-${row.category}-${index}`} row={row} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-gray-400 text-sm">
                  Showing page {page} of {totalPages} ({total} total records)
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
