function TimeRangeSelector({ timeRange, onTimeRangeChange, loading }) {
  const timeOptions = [
    { value: 'all_hour', label: 'Last Hour', icon: '⏱️' },
    { value: 'all_day', label: 'Last 24 Hours', icon: '📅' },
    { value: 'all_week', label: 'Last 7 Days', icon: '📆' },
    { value: 'all_month', label: 'Last 30 Days', icon: '🗓️' }
  ]

  const getApiUrl = (range) => {
    const baseUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary'
    return `${baseUrl}/${range}.geojson`
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-2 sm:p-3 border border-gray-200 w-full">
      <h3 className="text-xs font-semibold text-gray-700 mb-2">Time Range</h3>
      <div className="flex flex-wrap gap-2 w-full">
        {timeOptions.map((option) => {
          const isActive = timeRange === option.value
          return (
            <button
              key={option.value}
              onClick={() => onTimeRangeChange(option.value, getApiUrl(option.value))}
              disabled={loading}
              className={`px-3 py-2 rounded-md min-w-[42%] sm:min-w-[100px] mb-1 text-xs font-medium transition-all flex items-center gap-1 justify-center ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              style={{ minHeight: 40 }}
            >
              <span>{option.icon}</span>
              <span>{option.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default TimeRangeSelector

