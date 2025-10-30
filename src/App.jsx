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
  const [showMobileContent, setShowMobileContent] = useState(false)

  const handleMobileOpen = () => setShowMobileContent(true)
  const handleMobileClose = () => setShowMobileContent(false)

  // Modified event handler: close mobile drawer for fast interactions
  const wrapMobileClose = (fn) => (...args) => {
    fn && fn(...args)
    // Only auto-close if mobile menu was opened
    if (window.innerWidth <= 768) setShowMobileContent(false)
  }

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
      {/* Desktop Header */}
      <header className="hidden md:block bg-gradient-to-r from-blue-600 to-blue-800 text-white py-6 shadow-md flex-shrink-0">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight">
              <span className="mr-2">🌍</span>
              3D Earthquake Visualizer
            </h1>
            <div className="mt-4 flex items-center justify-center gap-4">
              <button
                onClick={() => fetchEarthquakes()}
                disabled={loading}
                className="bg-white text-blue-700 px-5 py-2 rounded-xl hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-semibold shadow"
              >
                <span className={loading ? 'animate-spin' : ''}>🔄</span>
                <span className="ml-2">Refresh Data</span>
              </button>
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`px-5 py-2 rounded-xl transition-all text-sm font-semibold shadow ${
                  autoRotate ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-white text-blue-700 hover:bg-blue-50'
                }`}
              >
                ⏯️ Auto Rotate {autoRotate ? 'OFF' : 'OFF'}
              </button>
              <button
                onClick={() => setEnableClustering(!enableClustering)}
                className={`px-5 py-2 rounded-xl transition-all text-sm font-semibold shadow ${
                  enableClustering ? 'bg-purple-500 hover:bg-purple-600 text-white' : 'bg-white text-blue-700 hover:bg-blue-50'
                }`}
              >
                🔗 Clustering {enableClustering ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Top Bar, shown only on mobile */}
      <div className="block md:hidden w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2 shadow-md">
        <div className="px-3 w-full">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-lg font-bold">🌍 Earthquake Visualizer</h1>
            {/* Content Drawer Open Button */}
            <button onClick={handleMobileOpen} className="rounded-full p-2 ml-2 bg-white bg-opacity-10 text-white flex items-center hover:bg-opacity-20 transition" aria-label="Open content drawer">
              <span role="img" aria-label="content">🧭</span>
            </button>
          </div>
          <div className="flex items-center gap-2 w-full overflow-x-auto text-xs justify-start">
            <button
              onClick={wrapMobileClose(() => fetchEarthquakes())}
              disabled={loading}
              className="bg-white bg-opacity-80 text-blue-600 px-2 py-1.5 rounded hover:bg-blue-50 disabled:opacity-60 transition font-semibold flex items-center gap-1 shadow-sm min-w-[40px]"
            >
              🔄 Refresh
            </button>
            <button
              onClick={wrapMobileClose(() => setAutoRotate(!autoRotate))}
              className={`px-2 py-1.5 rounded transition flex items-center gap-1 font-semibold shadow-sm min-w-[40px] text-xs
                ${autoRotate ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-white bg-opacity-80 text-blue-600 hover:bg-blue-50'}
              `}
            >
              ⏯️ Auto Rotate {autoRotate ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={wrapMobileClose(() => setEnableClustering(!enableClustering))}
              className={`px-2 py-1.5 rounded transition flex items-center gap-1 font-semibold shadow-sm min-w-[40px] text-xs
                ${enableClustering ? 'bg-purple-500 hover:bg-purple-600 text-white' : 'bg-white bg-opacity-80 text-blue-600 hover:bg-blue-50'}
              `}
            >
              🔗 Clustering {enableClustering ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile content slide-in drawer (collapsible) */}
      <div
        className={`fixed left-0 right-0 bottom-0 z-[1100] md:hidden bg-white text-gray-900 rounded-t-xl shadow-2xl transition-transform duration-300 ease-in-out ${showMobileContent ? 'translate-y-0' : 'translate-y-full'} max-h-[90vh] overflow-y-auto`} 
        style={{ minHeight: showMobileContent ? '52vh' : '0', pointerEvents: showMobileContent ? 'auto' : 'none' }}
      >
        {/* Close bar */}
        <div className="flex justify-between items-center border-b px-4 py-2">
          <span className="font-semibold text-base">App Content</span>
          <button onClick={handleMobileClose} className="text-2xl text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-full px-3 py-0.5 flex items-center" aria-label="Close content">×</button>
        </div>
        <div className="p-2 pb-8 flex flex-col gap-3">
          <SearchLocation 
            earthquakes={earthquakes}
            onFlyTo={wrapMobileClose(handleFlyTo)}
            onSelectEarthquake={wrapMobileClose(handleSelectEarthquake)}
          />
          <TimeRangeSelector 
            timeRange={timeRange}
            onTimeRangeChange={wrapMobileClose(handleTimeRangeChange)}
            loading={loading}
          />
          <button
            onClick={wrapMobileClose(() => setShowEducationalInfo(true))}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-700 transition-all flex items-center gap-2 text-sm font-semibold w-full justify-center"
          >
            📚 Learn About Earthquakes
          </button>
        </div>
        {/* App Legend at the bottom inside drawer */}
        <div className="border-t p-2 pb-5 flex justify-center">
          <Legend count={earthquakes.length} />
        </div>
      </div>

      {/* Main App Experience (always visible, but styled for desktop) */}
      <div className="hidden md:flex flex-1 min-h-0 w-full">
        <aside className="hidden md:flex flex-col w-64 bg-transparent py-6 px-2">
          <Legend count={earthquakes.length} />
        </aside>
        <main className="flex-1 relative min-h-0 w-full" onClick={handleGlobeClick}>
          <div className="absolute top-8 right-8 z-[1002] max-w-[95vw] md:max-w-sm">
            {selectedQuake && <InfoCard earthquake={selectedQuake} onClose={() => setSelectedQuake(null)} />}
          </div>
          <div className="w-full h-full">
            <GlobeView 
              earthquakes={earthquakes}
              onPointClick={handlePointClick}
              autoRotate={autoRotate}
              targetLocation={targetLocation}
              enableClustering={enableClustering}
            />
          </div>
          <div className="absolute top-8 left-8 z-[1001] flex flex-col gap-3">
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
        </main>
      </div>
      {/* Educational Features slides over everything (mobile + desktop) */}
      <EducationalFeatures showInfo={showEducationalInfo} onClose={handleMobileClose} />
    </div>
  )
}

export default App
