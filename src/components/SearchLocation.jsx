import { useState, useMemo } from 'react'

function SearchLocation({ earthquakes, onFlyTo, onSelectEarthquake }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showResults, setShowResults] = useState(false)

  // Search through earthquakes by location
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    
    const query = searchQuery.toLowerCase()
    return earthquakes
      .filter((eq) => {
        const place = eq.properties?.place || ''
        return place.toLowerCase().includes(query)
      })
      .slice(0, 10) // Limit to 10 results
      .map((eq) => {
        const coords = eq.geometry?.coordinates
        return {
          id: eq.id,
          place: eq.properties?.place || 'Unknown',
          magnitude: eq.properties?.mag || 0,
          lat: coords?.[1],
          lng: coords?.[0],
          time: eq.properties?.time,
          depth: coords?.[2],
          url: eq.properties?.url // Include USGS URL
        }
      })
  }, [searchQuery, earthquakes])

  const handleSelect = (result) => {
    if (result.lat && result.lng) {
      onFlyTo([result.lat, result.lng])
      onSelectEarthquake(result)
    }
    setSearchQuery('')
    setShowResults(false)
  }

  return (
    <div className="relative bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="p-3">
        <h3 className="text-xs font-semibold text-gray-700 mb-2">🔍 Search Location</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by location (e.g., California, Japan)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setShowResults(true)
            }}
            onFocus={() => setShowResults(true)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          {showResults && searchResults.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  className="w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{result.place}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(result.time).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        result.magnitude >= 5
                          ? 'bg-red-100 text-red-700'
                          : result.magnitude >= 3
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      M {result.magnitude?.toFixed(1)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        {searchQuery && searchResults.length === 0 && (
          <p className="text-xs text-gray-500 mt-2">No earthquakes found</p>
        )}
      </div>
    </div>
  )
}

export default SearchLocation

