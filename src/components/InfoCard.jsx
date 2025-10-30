function InfoCard({ earthquake, onClose }) {
  if (!earthquake) return null

  const getMagnitudeColor = (mag) => {
    if (mag >= 5) return '#ef4444'
    if (mag >= 3) return '#f97316'
    return '#10b981'
  }

  return (
    <div className="relative w-full">
      <div className="absolute top-0 right-0 left-0 sm:static bg-white rounded-lg shadow-2xl p-3 sm:p-5 max-w-full sm:max-w-sm z-[1000] border border-gray-200 overflow-auto min-w-[0] w-full sm:w-auto">
        <div className="flex justify-between items-start mb-3 gap-2">
          <h3 className="font-bold text-base sm:text-lg text-gray-800">Earthquake Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none rounded w-8 h-8 flex items-center justify-center focus:outline-none"
            aria-label="Close"
            tabIndex={0}
          >
            ×
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">Location</p>
            <p className="text-sm sm:text-base text-gray-900 font-medium">
              📍 {earthquake.place || 'Unknown Location'}
              {earthquake.isCluster && earthquake.count && (
                <span className="ml-2 text-xs sm:text-sm text-blue-600">
                  ({earthquake.count} earthquakes in cluster)
                </span>
              )}
            </p>
          </div>

          <div>
            <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">Magnitude</p>
            <p 
              className="text-xl sm:text-2xl font-bold"
              style={{ color: getMagnitudeColor(earthquake.magnitude) }}
            >
              {earthquake.magnitude?.toFixed(earthquake.magnitude >= 1 ? 1 : 2)}
            </p>
          </div>

          {earthquake.depth != null && (
            <div>
              <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">Depth</p>
              <p className="text-sm text-gray-700">
                {earthquake.depth.toFixed(1)} km
              </p>
            </div>
          )}

          <div>
            <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">Time</p>
            <p className="text-xs sm:text-sm text-gray-700">
              {new Date(earthquake.time).toLocaleString()}
            </p>
          </div>

          {earthquake.url && (
            <div className="pt-3 border-t border-gray-200">
              <a
                href={earthquake.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg min-h-[44px] text-base sm:text-sm"
              >
                <span>🔗</span>
                <span>More Info</span>
                <span className="text-xs opacity-75">↗</span>
              </a>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Opens USGS detail page
              </p>
            </div>
          )}

          {!earthquake.url && (
            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Click anywhere on the globe to close
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InfoCard

