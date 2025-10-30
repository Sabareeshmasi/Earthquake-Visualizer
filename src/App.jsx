import { useState, useEffect } from 'react'
import GlobeView from './components/GlobeView'
import Legend from './components/Legend'
import InfoCard from './components/InfoCard'
import TimeRangeSelector from './components/TimeRangeSelector'
import SearchLocation from './components/SearchLocation'
import EducationalFeatures from './components/EducationalFeatures'

function App() {
  const [earthquakes, setEarthquakes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [autoRotate, setAutoRotate] = useState(false)
  const [selectedQuake, setSelectedQuake] = useState(null)
  const [timeRange, setTimeRange] = useState('all_day')
  const [apiUrl, setApiUrl] = useState('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson')
  const [targetLocation, setTargetLocation] = useState(null)
  const [enableClustering, setEnableClustering] = useState(false)
  const [showEducationalInfo, setShowEducationalInfo] = useState(false)

  const fetchEarthquakes = async (url = apiUrl) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data?.type === 'FeatureCollection' && Array.isArray(data.features)) {
        setEarthquakes(data.features)
      } else {
        throw new Error('Invalid data format')
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch earthquake data')
      setEarthquakes([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEarthquakes(apiUrl)
  }, [apiUrl])

  const handleTimeRangeChange = (range, url) => {
    setTimeRange(range)
    setApiUrl(url)
  }

  const handlePointClick = (point) => {
    setSelectedQuake(point)
  }

  const handleGlobeClick = () => {
    setSelectedQuake(null)
  }

  const handleFlyTo = (location) => {
    setTargetLocation(location)
    // Reset after fly animation
    setTimeout(() => setTargetLocation(null), 1500)
  }

  const handleSelectEarthquake = (quake) => {
    setSelectedQuake(quake)
  }

  return (
    <div className="min-h-screen w-screen flex flex-col overflow-hidden bg-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 shadow-md flex-shrink-0">
        <div className="container max-w-full mx-auto px-2 sm:px-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-2 md:mb-3">
            🌍 Earthquake Visualizer
          </h1>
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 flex-wrap items-stretch sm:items-center">
            <button
              onClick={() => fetchEarthquakes()}
              disabled={loading}
              className="bg-white text-blue-600 px-5 py-2 rounded-md hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-sm font-semibold shadow-sm"
            >
              <span className={loading ? 'animate-spin' : ''}>🔄</span>
              {loading ? 'Loading...' : 'Refresh Data'}
            </button>
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`px-5 py-2 rounded-md transition-all flex items-center gap-2 text-sm font-semibold shadow-sm ${
                autoRotate
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-white text-blue-600 hover:bg-blue-50'
              }`}
            >
              <span>⏯️</span>
              Auto Rotate {autoRotate ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={() => setEnableClustering(!enableClustering)}
              className={`px-5 py-2 rounded-md transition-all flex items-center gap-2 text-sm font-semibold shadow-sm ${
                enableClustering
                  ? 'bg-purple-500 hover:bg-purple-600 text-white'
                  : 'bg-white text-blue-600 hover:bg-blue-50'
              }`}
            >
              <span>🔗</span>
              Clustering {enableClustering ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </header>

      {/* Status Messages */}
      {error && !loading && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 flex-shrink-0">
          <p className="font-semibold">Error loading data</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && earthquakes.length === 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 px-4 py-3 flex-shrink-0">
          <p className="font-semibold">No earthquakes found</p>
          <p className="text-sm">No earthquakes detected in the selected time range.</p>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-white font-medium text-lg">Loading Globe & Earthquake Data...</p>
          </div>
        </div>
      )}

      {/* Globe Container */}
      <div 
        className="flex-1 relative min-h-0 w-full overflow-hidden"
        onClick={handleGlobeClick}
      >
        <div className="w-full h-full">
          <GlobeView 
            earthquakes={earthquakes}
            onPointClick={handlePointClick}
            autoRotate={autoRotate}
            targetLocation={targetLocation}
            enableClustering={enableClustering}
          />
        </div>
        {/* Control Panels */}
        <div className="absolute top-2 left-2 sm:top-6 sm:left-6 z-[1000] space-y-2 sm:space-y-3 max-w-[95vw] w-[96vw] sm:w-auto md:max-w-xs p-1 sm:p-0">
          <SearchLocation 
            earthquakes={earthquakes}
            onFlyTo={handleFlyTo}
            onSelectEarthquake={handleSelectEarthquake}
          />
          <TimeRangeSelector 
            timeRange={timeRange}
            onTimeRangeChange={handleTimeRangeChange}
            loading={loading}
          />
          <button
            onClick={() => setShowEducationalInfo(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-700 transition-all flex items-center gap-2 text-sm font-semibold w-full justify-center"
          >
            📚 Learn About Earthquakes
          </button>
        </div>

        {/* Legend - Bottom Right, reposition for very small screens */}
        {!loading && earthquakes.length > 0 && (
          <div className="absolute bottom-2 right-2 sm:bottom-6 sm:right-6 max-w-[95vw] w-[90vw] sm:w-auto md:max-w-sm">
            <Legend count={earthquakes.length} />
          </div>
        )}

        {/* Info Card - Top Right, make it fluid for mobile */}
        {selectedQuake && (
          <div className="absolute top-2 right-2 sm:top-20 sm:right-6 max-w-[95vw] w-[90vw] sm:w-auto md:max-w-sm">
            <InfoCard 
              earthquake={selectedQuake}
              onClose={() => setSelectedQuake(null)}
            />
          </div>
        )}

        {/* Educational Features */}
        <EducationalFeatures showInfo={showEducationalInfo} onClose={() => setShowEducationalInfo(false)} />
      </div>
    </div>
  )
}

export default App
