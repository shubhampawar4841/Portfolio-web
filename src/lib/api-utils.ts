const API_KEY = "579b464db66ec23bdd0000013119f051c4b1402a44910e0864590ebc"

export async function fetchStatesAndCities(): Promise<{
  states: string[]
  cities: Record<string, string[]>
}> {
  try {
    const API_URL = "https://api.data.gov.in/resource/3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69"
    const res = await fetch(`${API_URL}?api-key=${API_KEY}&format=json&limit=5000`)
    
    if (!res.ok) throw new Error("Failed to fetch locations")
    
    const json = await res.json()
    const records = json.records || []

    const statesSet = new Set<string>()
    const citiesByState: Record<string, Set<string>> = {}

    records.forEach((r: any) => {
      const state = r.state?.trim()
      const city = r.city?.trim()

      if (!state) return

      statesSet.add(state)

      if (!citiesByState[state]) {
        citiesByState[state] = new Set<string>()
      }

      if (city) citiesByState[state].add(city)
    })

    // Convert Sets to arrays
    return {
      states: [...statesSet].sort(),
      cities: Object.fromEntries(
        Object.entries(citiesByState).map(([s, set]) => [s, [...set].sort()])
      ),
    }
  } catch (error) {
    console.error("Error fetching states and cities:", error)
    return { states: [], cities: {} }
  }
}

