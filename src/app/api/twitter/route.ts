import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

// Cache for parsed CSV data
let cachedTweets: any[] | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Helper function to read and parse a CSV file
function readCSVFile(filePath: string): any[] {
  try {
    let csvBuffer = fs.readFileSync(filePath)
    
    // Remove UTF-8 BOM if present (EF BB BF)
    if (csvBuffer[0] === 0xEF && csvBuffer[1] === 0xBB && csvBuffer[2] === 0xBF) {
      csvBuffer = csvBuffer.slice(3)
    }
    
    // Convert buffer to string
    let csvContent = csvBuffer.toString('utf-8')
    
    // Also check for Unicode BOM character
    if (csvContent.charCodeAt(0) === 0xFEFF) {
      csvContent = csvContent.slice(1)
    }
    
    // Parse with proper headers
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      quote: '"',
      escape: '"',
      relax_quotes: true,
      relax_column_count: true,
    })
    
    return records
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error)
    return []
  }
}

// Helper function to normalize column names (handle different capitalizations)
function normalizeTweet(tweet: any): any {
  // Normalize column names to lowercase for consistency
  const normalized: any = {}
  
  // Map all possible column name variations
  normalized.ID = tweet.ID || tweet.id || ''
  normalized.Text = tweet.Text || tweet.text || ''
  normalized.Language = tweet.Language || tweet.language || 'en'
  normalized.Type = tweet.Type || tweet.type || 'Tweet'
  normalized['Author Name'] = tweet['Author Name'] || tweet['author name'] || 'Shubhampawar4841'
  normalized['Author Username'] = tweet['Author Username'] || tweet['author username'] || 'Shubhampawar484'
  normalized['View Count'] = parseInt(tweet['View Count'] || tweet['view count'] || '0') || 0
  normalized['Reply Count'] = parseInt(tweet['Reply Count'] || tweet['reply count'] || '0') || 0
  normalized['Retweet Count'] = parseInt(tweet['Retweet Count'] || tweet['retweet count'] || '0') || 0
  normalized['Quote Count'] = parseInt(tweet['Quote Count'] || tweet['quote count'] || '0') || 0
  normalized['Favorite Count'] = parseInt(tweet['Favorite Count'] || tweet['favorite count'] || '0') || 0
  normalized['Bookmark Count'] = parseInt(tweet['Bookmark Count'] || tweet['bookmark count'] || '0') || 0
  normalized['Created At'] = tweet['Created At'] || tweet['created at'] || ''
  normalized['Tweet URL'] = tweet['Tweet URL'] || tweet['tweet url'] || ''
  normalized.Source = tweet.Source || tweet.source || ''
  
  // Handle hashtags (different capitalizations)
  normalized.hashtags = tweet.hashtags || tweet.Hashtags || tweet.hashtag || ''
  
  // Handle URLs (different capitalizations)
  normalized.urls = tweet.urls || tweet.URLs || tweet.url || ''
  
  // Handle media (different capitalizations)
  normalized['media_type'] = tweet['media_type'] || tweet['Media Type'] || tweet['media type'] || ''
  normalized['media_urls'] = tweet['media_urls'] || tweet['Media URLs'] || tweet['media urls'] || ''
  
  return normalized
}

// Helper function to convert thumbnail URLs to full-size images
function convertToFullSize(url: string): string {
  if (!url) return url
  
  // For Twitter media URLs, try to get larger versions
  if (url.includes('pbs.twimg.com')) {
    // Remove or replace name parameter for better quality
    url = url.replace(/[?&]name=tiny/g, '')
    url = url.replace(/[?&]name=small/g, '')
    
    // For media URLs, try to get original size by removing format restrictions
    if (url.includes('/media/')) {
      url = url.replace(/[?&]format=[^&]*/g, '')
      url = url.replace(/[?&]name=[^&]*/g, '')
      url = url.replace(/[?&]$/, '')
    } else if (url.includes('ext_tw_video_thumb') || url.includes('tweet_video_thumb')) {
      url = url.replace(/name=tiny/g, 'name=large')
      url = url.replace(/name=small/g, 'name=large')
    }
  }
  
  return url
}

// NEW: Using all three CSV files (TwExport, TwExtract-145, TwExtract-160)
function getCachedTweets() {
  const now = Date.now()
  const csvFiles = [
    path.join(process.cwd(), 'public', 'TwExport_Shubhampawar484_Posts.csv'),
    path.join(process.cwd(), 'public', 'TwExtract-Shubhampawar484-145.csv'),
    path.join(process.cwd(), 'public', 'TwExtract-Shubhampawar484-160.csv'),
  ]
  
  // Check if cache is valid
  if (cachedTweets && (now - cacheTimestamp) < CACHE_DURATION) {
    let allFilesUnchanged = true
    for (const csvPath of csvFiles) {
      try {
        const stats = fs.statSync(csvPath)
        if (stats.mtimeMs > cacheTimestamp) {
          allFilesUnchanged = false
          break
        }
      } catch {
        // File might not exist, skip
      }
    }
    if (allFilesUnchanged) {
      return cachedTweets
    }
  }
  
  // Read and combine all CSV files
  const allRecords: any[] = []
  
  for (const csvPath of csvFiles) {
    const records = readCSVFile(csvPath)
    allRecords.push(...records)
  }
  
  // Transform and normalize all records
  const transformedRecords = allRecords.map((tweet: any) => {
    const normalized = normalizeTweet(tweet)
    
    // Parse media URLs
    let mediaUrls: string[] = []
    if (normalized['media_urls']) {
      // Media URLs can be newline-separated or comma-separated
      mediaUrls = normalized['media_urls']
        .split(/[\n,]/)
        .map((url: string) => url.trim())
        .filter((url: string) => url && !url.includes('/emoji/') && !url.includes('abs-0.twimg.com/emoji'))
        .map(convertToFullSize)
    }
    
    // Determine media type
    let mediaType = normalized['media_type'] || ''
    if (mediaUrls.length > 0 && !mediaType) {
      const firstMedia = mediaUrls[0]
      if (firstMedia.includes('ext_tw_video_thumb') || firstMedia.includes('amplify_video') || firstMedia.includes('tweet_video_thumb')) {
        mediaType = 'photo' // Show thumbnails as images
      } else if (firstMedia.includes('video') || firstMedia.includes('ext_tw_video')) {
        mediaType = 'video'
      } else {
        mediaType = 'photo'
      }
    }
    
    // Extract hashtags from text if not already present
    let hashtags = normalized.hashtags
    if (!hashtags && normalized.Text) {
      const hashtagMatches = normalized.Text.match(/#\w+/g) || []
      hashtags = hashtagMatches.map((tag: string) => tag.trim()).join(',')
    }
    
    return {
      ID: normalized.ID,
      Text: normalized.Text.trim(),
      Language: normalized.Language || 'en',
      Type: normalized.Type || 'Tweet',
      'Author Name': normalized['Author Name'],
      'Author Username': normalized['Author Username'],
      'View Count': normalized['View Count'],
      'Reply Count': normalized['Reply Count'],
      'Retweet Count': normalized['Retweet Count'],
      'Quote Count': normalized['Quote Count'],
      'Favorite Count': normalized['Favorite Count'],
      'Bookmark Count': normalized['Bookmark Count'],
      'Created At': normalized['Created At'],
      'Tweet URL': normalized['Tweet URL'],
      Source: normalized.Source,
      hashtags: hashtags,
      urls: normalized.urls,
      'media_type': mediaType,
      'media_urls': mediaUrls.join('\n'),
    }
  })
  
  // Update cache
  cachedTweets = transformedRecords
  cacheTimestamp = now
  
  return transformedRecords
}

// OLD: Previous implementation using x.csv (commented for revert)
/*
function getCachedTweets() {
  const now = Date.now()
  const csvPath = path.join(process.cwd(), 'public', 'x.csv')
  
  // Check if cache is valid
  if (cachedTweets && (now - cacheTimestamp) < CACHE_DURATION) {
    const stats = fs.statSync(csvPath)
    // If file hasn't changed, return cache
    if (stats.mtimeMs <= cacheTimestamp) {
      return cachedTweets
    }
  }
  
  // Read and parse CSV - handle BOM properly
  let csvBuffer = fs.readFileSync(csvPath)
  
  // Remove UTF-8 BOM if present (EF BB BF)
  if (csvBuffer[0] === 0xEF && csvBuffer[1] === 0xBB && csvBuffer[2] === 0xBF) {
    csvBuffer = csvBuffer.slice(3)
  }
  
  // Convert buffer to string
  let csvContent = csvBuffer.toString('utf-8')
  
  // Also check for Unicode BOM character
  if (csvContent.charCodeAt(0) === 0xFEFF) {
    csvContent = csvContent.slice(1)
  }
  
  // Parse without headers (headers are CSS class names, not useful)
  // Map columns by index:
  // 0: profile image, 1: profile link, 2: author name, 3: username, 4: separator,
  // 5: tweet URL, 6: emoji, 7: tweet text, 8: media thumbnail, 9-11: video info,
  // 12-13: numbers, 14: analytics URL, 15: view count, etc.
  const records = parse(csvContent, {
    columns: false,
    skip_empty_lines: true,
    quote: '"',
    escape: '"',
    relax_quotes: true,
    relax_column_count: true,
    from_line: 2, // Skip header row
  })
  
  // Transform records to structured format
  const transformedRecords = records.map((row: any[]) => {
    // Extract tweet ID from URL if available
    const tweetUrl = row[5] || ''
    const tweetId = tweetUrl.match(/status\/(\d+)/)?.[1] || ''
    
    // Extract media URLs - filter out emoji URLs
    const mediaUrls: string[] = []
    const isEmojiUrl = (url: string) => {
      // Filter out emoji SVG/image URLs
      return url.includes('/emoji/') || url.includes('abs-0.twimg.com/emoji')
    }
    
    // Check column 8 for media (skip emoji URLs)
    if (row[8] && row[8].includes('twimg.com') && !isEmojiUrl(row[8])) {
      // Check if it's a video thumbnail or actual media
      if (row[8].includes('ext_tw_video') || row[8].includes('amplify_video') || row[8].includes('video')) {
        mediaUrls.push(row[8])
      } else if (row[8].includes('media') || row[8].includes('pbs.twimg.com')) {
        mediaUrls.push(row[8])
      }
    }
    
    // Check for additional media columns (skip emoji URLs)
    for (let i = 21; i < Math.min(30, row.length); i++) {
      if (row[i] && typeof row[i] === 'string' && row[i].includes('twimg.com') && !isEmojiUrl(row[i])) {
        // Only add if it's actual media, not emoji
        if ((row[i].includes('media') || row[i].includes('video') || row[i].includes('pbs.twimg.com')) && !mediaUrls.includes(row[i])) {
          mediaUrls.push(row[i])
        }
      }
    }
    
    // Determine media type
    let mediaType = ''
    if (mediaUrls.length > 0) {
      const firstMedia = mediaUrls[0]
      if (firstMedia.includes('video') || firstMedia.includes('ext_tw_video') || firstMedia.includes('amplify_video')) {
        mediaType = 'video'
      } else {
        mediaType = 'photo'
      }
    }
    
    // Extract full tweet text - combine text from multiple columns
    // Column 7 is the main text, but additional text might be in later columns
    let text = row[7] || ''
    
    // Combine additional text from columns that contain tweet content (not URLs, not emoji URLs)
    // Check columns 20-25 for additional tweet text
    const additionalTextParts: string[] = []
    for (let i = 20; i < Math.min(26, row.length); i++) {
      if (row[i] && typeof row[i] === 'string') {
        const cellValue = row[i].trim()
        // Skip if it's a URL, emoji URL, hashtag link, or empty
        if (cellValue && 
            !cellValue.startsWith('http') && 
            !cellValue.includes('/emoji/') &&
            !cellValue.includes('abs-0.twimg.com') &&
            !cellValue.includes('x.com/i/communities') &&
            cellValue.length > 3) { // Only meaningful text
          additionalTextParts.push(cellValue)
        }
      }
    }
    
    // Combine all text parts
    if (additionalTextParts.length > 0) {
      text = [text, ...additionalTextParts].filter(t => t).join('\n')
    }
    
    // Clean up text
    text = text.trim()
    
    // Extract hashtags from text (look for #hashtag pattern)
    const hashtagMatches = text.match(/#\w+/g) || []
    const hashtags = hashtagMatches.map((tag: string) => tag.trim())
    
    // Parse view count
    const viewCount = parseInt(row[15] || '0') || 0
    
    return {
      ID: tweetId,
      Text: text,
      Language: 'en',
      Type: 'Tweet',
      'Author Name': row[2] || 'Shubhampawar4841',
      'Author Username': (row[3] || '@Shubhampawar484').replace('@', ''),
      'View Count': viewCount,
      'Reply Count': parseInt(row[12] || '0') || 0,
      'Retweet Count': 0, // Not available in this format
      'Quote Count': 0, // Not available in this format
      'Favorite Count': parseInt(row[13] || '0') || 0,
      'Bookmark Count': 0, // Not available in this format
      'Created At': '', // Not available in this format
      'Tweet URL': tweetUrl,
      Source: '',
      hashtags: hashtags.join(','),
      urls: '',
      'media_type': mediaType,
      'media_urls': mediaUrls.join('\n'),
      'Profile Image': row[0] || '',
    }
  })
  
  // Update cache
  cachedTweets = transformedRecords
  cacheTimestamp = now
  
  return transformedRecords
}
*/

// OLD: Previous implementation using TwExport_Shubhampawar484_Posts.csv
// Commented out for easy revert if needed
/*
function getCachedTweets() {
  const now = Date.now()
  const csvPath = path.join(process.cwd(), 'public', 'TwExport_Shubhampawar484_Posts.csv')
  
  // Check if cache is valid
  if (cachedTweets && (now - cacheTimestamp) < CACHE_DURATION) {
    const stats = fs.statSync(csvPath)
    // If file hasn't changed, return cache
    if (stats.mtimeMs <= cacheTimestamp) {
      return cachedTweets
    }
  }
  
  // Read and parse CSV - handle BOM properly
  let csvBuffer = fs.readFileSync(csvPath)
  
  // Remove UTF-8 BOM if present (EF BB BF)
  if (csvBuffer[0] === 0xEF && csvBuffer[1] === 0xBB && csvBuffer[2] === 0xBF) {
    csvBuffer = csvBuffer.slice(3)
  }
  
  // Convert buffer to string
  let csvContent = csvBuffer.toString('utf-8')
  
  // Also check for Unicode BOM character
  if (csvContent.charCodeAt(0) === 0xFEFF) {
    csvContent = csvContent.slice(1)
  }
  
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    quote: '"',
    escape: '"',
    relax_quotes: true,
    relax_column_count: true,
    cast: (value, context) => {
      if (!value || value === '') return value
      // Parse numeric fields
      if (context.column === 'View Count') return parseInt(value) || 0
      if (context.column === 'Reply Count') return parseInt(value) || 0
      if (context.column === 'Retweet Count') return parseInt(value) || 0
      if (context.column === 'Quote Count') return parseInt(value) || 0
      if (context.column === 'Favorite Count') return parseInt(value) || 0
      if (context.column === 'Bookmark Count') return parseInt(value) || 0
      return value
    }
  })
  
  // Update cache
  cachedTweets = records
  cacheTimestamp = now
  
  return records
}
*/

// Shuffle array function
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export async function GET(request: Request) {
  try {
    // NEW: Using all three CSV files
    // - TwExport_Shubhampawar484_Posts.csv
    // - TwExtract-Shubhampawar484-145.csv
    // - TwExtract-Shubhampawar484-160.csv
    
    // OLD: Previous file paths (commented for revert)
    // const csvPath = path.join(process.cwd(), 'public', 'export.csv')
    // const csvPath = path.join(process.cwd(), 'public', 'x.csv')

    // Get cached tweets
    const allTweets = getCachedTweets()

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const count = parseInt(searchParams.get('count') || '10')
    const type = searchParams.get('type') || 'all' // all, tweet, reply, retweet
    const codingJourney = searchParams.get('codingJourney') === 'true' // Filter for 365 days of coding tweets

    // Filter by type if specified
    let filtered = allTweets
    if (type !== 'all') {
      filtered = allTweets.filter((tweet: any) => 
        tweet.Type?.toLowerCase() === type.toLowerCase()
      )
    }

    // Filter for 365 days of coding tweets (Day X pattern)
    if (codingJourney) {
      filtered = filtered.filter((tweet: any) => {
        const text = tweet.Text || ''
        // Match patterns like "Day 368", "Day 364/365", "📅 Day 367", etc.
        const dayPattern = /(?:📅\s*)?Day\s+\d+(?:\/\d+)?/i
        return dayPattern.test(text)
      })
    }

    // Shuffle and get random tweets
    const shuffled = shuffleArray(filtered)
    const randomTweets = shuffled.slice(0, Math.min(count, shuffled.length))

    // Format tweets for frontend
    const formattedTweets = randomTweets.map((tweet: any) => {
      // Parse media URLs if they exist
      let mediaUrls: string[] = []
      if (tweet['media_urls']) {
        mediaUrls = tweet['media_urls'].split('\n').filter((url: string) => url.trim())
      }

      // Parse hashtags
      let hashtags: string[] = []
      if (tweet.hashtags) {
        hashtags = tweet.hashtags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
      }

      return {
        id: tweet.ID,
        text: tweet.Text || '',
        language: tweet.Language || 'en',
        type: tweet.Type || 'Tweet',
        authorName: tweet['Author Name'] || 'Shubhampawar4841',
        authorUsername: tweet['Author Username'] || 'Shubhampawar484',
        viewCount: tweet['View Count'] || 0,
        replyCount: tweet['Reply Count'] || 0,
        retweetCount: tweet['Retweet Count'] || 0,
        quoteCount: tweet['Quote Count'] || 0,
        favoriteCount: tweet['Favorite Count'] || 0,
        bookmarkCount: tweet['Bookmark Count'] || 0,
        createdAt: tweet['Created At'] || '',
        tweetUrl: tweet['Tweet URL'] || '',
        source: tweet.Source || '',
        hashtags,
        urls: tweet.urls || '',
        mediaType: tweet['media_type'] || '',
        mediaUrls,
      }
    })

    return NextResponse.json({
      tweets: formattedTweets,
      total: filtered.length,
      count: formattedTweets.length
    })
  } catch (error: any) {
    console.error('Error reading Twitter CSV:', error)
    return NextResponse.json(
      { error: 'Failed to read Twitter CSV', details: error.message },
      { status: 500 }
    )
  }
}

