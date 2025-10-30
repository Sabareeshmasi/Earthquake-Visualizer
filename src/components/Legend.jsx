function Legend({ count = 0 }) {
  return (
    <div 
      className="absolute bottom-0 left-0 right-0 sm:bottom-6 sm:left-6 sm:right-auto mx-2 sm:mx-0 bg-white rounded-lg shadow-xl p-3 sm:p-4 border border-gray-200 z-[1000] w-full sm:w-auto max-w-full sm:max-w-xs overflow-auto"
      style={{ 
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)'
      }}
    >
      <h3 className="font-bold text-sm mb-3 text-gray-800 border-b pb-2">
        Magnitude Scale
      </h3>
      <div className="space-y-2.5 text-xs">
        <div className="flex items-center gap-3">
          <div 
            className="w-5 h-5 rounded-full border-2 border-white shadow-md"
            style={{ backgroundColor: '#10b981' }}
          ></div>
          <span className="text-gray-700 font-medium">Magnitude &lt; 3</span>
        </div>
        <div className="flex items-center gap-3">
          <div 
            className="w-5 h-5 rounded-full border-2 border-white shadow-md"
            style={{ backgroundColor: '#f97316' }}
          ></div>
          <span className="text-gray-700 font-medium">Magnitude 3 - 5</span>
        </div>
        <div className="flex items-center gap-3">
          <div 
            className="w-5 h-5 rounded-full border-2 border-white shadow-md"
            style={{ backgroundColor: '#ef4444' }}
          ></div>
          <span className="text-gray-700 font-medium">Magnitude &gt; 5</span>
        </div>
      </div>
      {count > 0 && (
        <div className="mt-3 pt-3 border-t text-xs text-gray-500">
          {count} earthquake{count !== 1 ? 's' : ''} shown
        </div>
      )}
    </div>
  )
}

export default Legend
