import { useState } from 'react'

function EducationalFeatures({ showInfo, onClose }) {
  const [activeTab, setActiveTab] = useState('scale')

  const richterScale = [
    { magnitude: '< 3.0', description: 'Micro', effect: 'Generally not felt, but recorded.', color: '#10b981' },
    { magnitude: '3.0 - 3.9', description: 'Minor', effect: 'Often felt, but rarely causes damage.', color: '#10b981' },
    { magnitude: '4.0 - 4.9', description: 'Light', effect: 'Noticeable shaking, minor damage possible.', color: '#f97316' },
    { magnitude: '5.0 - 5.9', description: 'Moderate', effect: 'Can cause damage to buildings.', color: '#f97316' },
    { magnitude: '6.0 - 6.9', description: 'Strong', effect: 'Can be destructive in populated areas.', color: '#ef4444' },
    { magnitude: '7.0 - 7.9', description: 'Major', effect: 'Can cause serious damage over large areas.', color: '#ef4444' },
    { magnitude: '8.0+', description: 'Great', effect: 'Can cause catastrophic damage.', color: '#dc2626' }
  ]

  const tectonicPlates = [
    {
      name: 'Pacific Plate',
      description: 'The largest tectonic plate, covering most of the Pacific Ocean. It\'s actively moving and causes frequent earthquakes and volcanic activity along the Ring of Fire.',
      details: 'The Pacific Plate is the largest tectonic plate on Earth, covering approximately 103 million square kilometers. It moves northwest at about 7-10 cm per year. This plate is responsible for most seismic activity along the Pacific Ring of Fire, including frequent earthquakes in Japan, Alaska, California, and Chile. Subduction zones around its edges create deep ocean trenches and volcanic arcs. The plate contains numerous hotspots including Hawaii.'
    },
    {
      name: 'North American Plate',
      description: 'Covers North America, parts of the Atlantic Ocean, and extends into Siberia. Home to the San Andreas Fault in California.',
      details: 'The North American Plate includes most of North America, Greenland, Cuba, the Bahamas, and parts of Siberia. It moves west-southwest at about 2.3 cm per year. The famous San Andreas Fault is where it interacts with the Pacific Plate, causing frequent earthquakes in California. The plate also creates the Mid-Atlantic Ridge where it diverges from the Eurasian Plate. Yellowstone supervolcano sits on this plate.'
    },
    {
      name: 'Eurasian Plate',
      description: 'The second-largest plate, covering Europe, Asia (except India), and parts of the Atlantic. Contains diverse boundary types.',
      details: 'The Eurasian Plate is one of the largest plates, covering Europe and most of Asia. It moves eastward at about 1.5-2 cm per year. The plate includes the Mid-Atlantic Ridge where it diverges from North American Plate. Major earthquake zones include Italy, Greece, Turkey, and Central Asia. The plate is being compressed from the south by the African and Indo-Australian Plates, creating the Himalayas and Alps mountain ranges.'
    },
    {
      name: 'African Plate',
      description: 'Includes the African continent and surrounding ocean. The East African Rift is splitting it apart.',
      details: 'The African Plate covers Africa and surrounding oceanic areas. It moves northeast at about 2.15 cm per year. The East African Rift System is actively splitting the plate in two, which may create a new ocean in millions of years. The plate\'s collision with the Eurasian Plate created the Mediterranean Sea and Alps. Mount Kilimanjaro and other East African volcanoes result from rift-related volcanism.'
    },
    {
      name: 'Indo-Australian Plate',
      description: 'Split into Indian and Australian sub-plates. Collision with Eurasian Plate formed the Himalayas.',
      details: 'The Indo-Australian Plate is actually two separate plates moving together: the Indian Plate and Australian Plate. It moves northeast at about 6 cm per year. The collision between the Indian Plate and Eurasian Plate created the Himalayas, the world\'s highest mountain range. This ongoing collision causes frequent earthquakes in India, Nepal, and Pakistan. The 2004 Indian Ocean tsunami was caused by subduction at this plate\'s boundaries.'
    },
    {
      name: 'Antarctic Plate',
      description: 'Covers Antarctica and surrounding ocean. Mostly surrounded by divergent boundaries.',
      details: 'The Antarctic Plate covers Antarctica and surrounding Southern Ocean. It moves very slowly, at about 1 cm per year. The plate is surrounded by spreading centers and transform faults. Unlike other plates, it experiences relatively few major earthquakes due to low population and mostly oceanic boundaries. The plate plays a crucial role in global climate due to its ice sheet. Subduction occurs only along the South Shetland Trench.'
    },
    {
      name: 'South American Plate',
      description: 'Includes South America and parts of the Atlantic. The Nazca Plate subducts beneath it, creating the Andes.',
      details: 'The South American Plate includes the continent and part of the Atlantic Ocean floor. It moves west at about 3.5 cm per year. The Nazca Plate subducts beneath its western edge, creating the massive Andes mountain range and frequent earthquakes in Chile and Peru. The collision caused the largest recorded earthquake (Chile, 1960, M 9.5). The plate diverges from the African Plate along the Mid-Atlantic Ridge.'
    },
    {
      name: 'Nazca Plate',
      description: 'Small oceanic plate off the west coast of South America. High earthquake activity due to subduction.',
      details: 'The Nazca Plate is an oceanic plate located off the west coast of South America. It moves east and subducts beneath the South American Plate at about 7 cm per year. This subduction creates the deepest ocean trench (Peru-Chile Trench), the Andes Mountains, and causes frequent devastating earthquakes. The plate is known for producing some of the world\'s strongest earthquakes, including multiple events over magnitude 8.0.'
    },
    {
      name: 'Caribbean Plate',
      description: 'Small plate in the Caribbean region. Complex boundaries with multiple plates cause high seismicity.',
      details: 'The Caribbean Plate is a small tectonic plate underlying Central America and the Caribbean Sea. It moves east at about 1.4 cm per year relative to North America. The plate interacts with North American, South American, and Cocos Plates, creating complex fault systems. This interaction causes frequent earthquakes and volcanic activity throughout the Caribbean, including the devastating 2010 Haiti earthquake. The region has over 100 active volcanoes.'
    },
    {
      name: 'Arabian Plate',
      description: 'Separated from Africa by the Red Sea. Moving north, colliding with Eurasian Plate to form mountains.',
      details: 'The Arabian Plate includes the Arabian Peninsula, extending into parts of the Middle East. It moves north at about 2.5 cm per year. The plate is separating from the African Plate along the Red Sea Rift and Gulf of Aden. Its collision with the Eurasian Plate is creating mountains in Iran, Turkey, and the Caucasus. The Zagros Mountains in Iran are actively forming from this collision. The Dead Sea Transform Fault marks part of its boundary.'
    },
    {
      name: 'Philippine Sea Plate',
      description: 'Small oceanic plate in the western Pacific. Complex interactions create the Philippine island arc.',
      details: 'The Philippine Sea Plate is a small oceanic plate in the western Pacific. It moves northwest at about 6-7 cm per year. The plate is subducting beneath the Eurasian Plate, creating the Philippine Islands, Mariana Islands, and Ryukyu Islands. This subduction forms deep ocean trenches including the Mariana Trench, the deepest point on Earth. Frequent earthquakes and tsunamis occur along its boundaries. The plate also interacts with the Pacific Plate along transform faults.'
    },
    {
      name: 'Cocos Plate',
      description: 'Small oceanic plate off Central America. Subducts beneath Caribbean Plate, causing earthquakes and volcanos.',
      details: 'The Cocos Plate is a small oceanic plate located off the west coast of Central America. It moves northeast and subducts beneath the Caribbean Plate at about 8.5 cm per year. This subduction creates the Central American Volcanic Arc with over 70 active volcanoes. The process causes frequent earthquakes in Mexico, Guatemala, El Salvador, and Costa Rica. Major earthquakes include the 1985 Mexico City earthquake (M 8.0) that killed over 10,000 people.'
    }
  ]

  const majorQuakes = [
    { 
      year: 1960, 
      location: 'Chile', 
      magnitude: 9.5, 
      note: 'Largest recorded earthquake',
      disaster: 'The Valdivia earthquake, the most powerful earthquake ever recorded, caused massive devastation across southern Chile. The quake triggered a tsunami that reached Hawaii, Japan, and the Philippines. Over 1,600 people were killed, and millions were left homeless. The disaster caused widespread landslides, floods, and volcanic eruptions. Economic damage was catastrophic, destroying infrastructure, buildings, and industries across the region.'
    },
    { 
      year: 2004, 
      location: 'Indian Ocean', 
      magnitude: 9.1, 
      note: 'Caused devastating tsunami',
      disaster: 'The Sumatra-Andaman earthquake triggered one of the deadliest tsunamis in history. The massive wave struck 14 countries bordering the Indian Ocean, killing over 230,000 people. Indonesia, Sri Lanka, India, and Thailand were hardest hit. Entire coastal communities were wiped out, and millions were displaced. The disaster led to improved tsunami warning systems worldwide. Relief efforts became the largest humanitarian response in history.'
    },
    { 
      year: 2011, 
      location: 'Japan', 
      magnitude: 9.0, 
      note: 'Tohoku earthquake and tsunami',
      disaster: 'The Great East Japan Earthquake caused a devastating tsunami with waves reaching 40 meters in height. The disaster triggered a nuclear meltdown at the Fukushima Daiichi Nuclear Power Plant, leading to radioactive contamination and mass evacuations. Nearly 20,000 people lost their lives, with tens of thousands displaced. The earthquake shifted the Earth\'s axis and shortened the day. It caused the costliest natural disaster in world history, with damages exceeding $360 billion.'
    },
    { 
      year: 1906, 
      location: 'San Francisco', 
      magnitude: 7.9, 
      note: 'Major destruction',
      disaster: 'The Great San Francisco Earthquake was one of the worst natural disasters in U.S. history. The quake and resulting fires destroyed over 80% of the city. More than 3,000 people perished, and over 400,000 were left homeless. Fires burned for three days, consuming 28,000 buildings. The disaster led to improved building codes and earthquake preparedness. It remains a defining event in California\'s history and spurred modern seismology research.'
    },
    { 
      year: 1964, 
      location: 'Alaska', 
      magnitude: 9.2, 
      note: 'Most powerful U.S. earthquake',
      disaster: 'The Great Alaska Earthquake was the most powerful recorded earthquake in North American history. Lasting nearly 5 minutes, it caused massive ground liquefaction, landslides, and tsunamis. The port city of Valdez was destroyed by massive ground subsidence. Tsunamis reached heights of 67 meters and caused damage as far away as California. Despite its magnitude, only 139 people died due to low population density. The disaster resulted in improved building standards and tsunami warning systems.'
    }
  ]

  const [selectedQuake, setSelectedQuake] = useState(null)
  const [selectedPlate, setSelectedPlate] = useState(null)

  if (!showInfo) return null

  return (
    <>
      {showInfo && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-[2000] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Educational Resources</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              {[
                { id: 'scale', label: 'Richter Scale', icon: '📊' },
                { id: 'plates', label: 'Tectonic Plates', icon: '🌋' },
                { id: 'history', label: 'Major Quakes', icon: '📜' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    setSelectedQuake(null) // Reset selection when switching tabs
                    setSelectedPlate(null) // Reset plate selection when switching tabs
                  }}
                  className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'scale' && (
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Richter Magnitude Scale</h3>
                  <p className="text-gray-600 mb-6">
                    The Richter scale measures the magnitude of an earthquake on a logarithmic scale. Each whole number increase represents a tenfold increase in amplitude.
                  </p>
                  <div className="space-y-3">
                    {richterScale.map((item, idx) => (
                      <div
                        key={idx}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full border-2 border-white shadow"
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-gray-900">{item.magnitude}</span>
                              <span className="text-sm text-gray-600">{item.description}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{item.effect}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'plates' && (
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Tectonic Plates</h3>
                  <p className="text-gray-600 mb-6">
                    Earth's surface is divided into large tectonic plates that move slowly. Most earthquakes occur along plate boundaries where these plates interact. Click on any plate to learn more:
                  </p>
                  {selectedPlate ? (
                    <div className="space-y-4">
                      <button
                        onClick={() => setSelectedPlate(null)}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 mb-4"
                      >
                        ← Back to List
                      </button>
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-4xl">🌍</span>
                          <h4 className="font-bold text-2xl text-gray-900">{selectedPlate.name}</h4>
                        </div>
                        <p className="text-gray-700 mb-4 font-medium italic">{selectedPlate.description}</p>
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <h5 className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
                            📖 Detailed Information
                          </h5>
                          <p className="text-gray-700 leading-relaxed">{selectedPlate.details}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {tectonicPlates.map((plate, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedPlate(plate)}
                            className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm font-medium text-blue-900 hover:bg-blue-100 hover:border-blue-400 hover:shadow-md transition-all text-left flex items-center justify-between group"
                          >
                            <span className="flex items-center gap-2">
                              <span>🌍</span>
                              <span>{plate.name}</span>
                            </span>
                            <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                          </button>
                        ))}
                      </div>
                      <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                        <p className="text-sm text-gray-700">
                          <strong>Did you know?</strong> The Pacific Ring of Fire is a major area where many earthquakes occur due to tectonic plate boundaries. About 90% of the world's earthquakes happen along these boundaries.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'history' && (
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Major Historical Earthquakes</h3>
                  <p className="text-gray-600 mb-6">
                    Some of the most significant earthquakes recorded in history. Click on any earthquake to learn more about the disaster:
                  </p>
                  {selectedQuake ? (
                    <div className="space-y-4">
                      <button
                        onClick={() => setSelectedQuake(null)}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 mb-4"
                      >
                        ← Back to List
                      </button>
                      <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="font-bold text-3xl text-gray-900">{selectedQuake.year}</span>
                          <span
                            className="px-4 py-2 rounded-full text-lg font-bold text-white"
                            style={{
                              backgroundColor: selectedQuake.magnitude >= 8 ? '#dc2626' : '#ef4444'
                            }}
                          >
                            M {selectedQuake.magnitude}
                          </span>
                        </div>
                        <h4 className="font-bold text-2xl text-gray-900 mb-2">{selectedQuake.location} Earthquake</h4>
                        <p className="text-sm text-gray-600 mb-4 italic">{selectedQuake.note}</p>
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <h5 className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
                            🌊 Disaster Impact & Details
                          </h5>
                          <p className="text-gray-700 leading-relaxed">{selectedQuake.disaster}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {majorQuakes.map((quake, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedQuake(quake)}
                          className="w-full text-left border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-400 transition-all bg-white hover:bg-blue-50"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-bold text-xl text-gray-900">{quake.year}</span>
                                <span
                                  className="px-3 py-1 rounded-full text-sm font-bold text-white"
                                  style={{
                                    backgroundColor: quake.magnitude >= 8 ? '#dc2626' : '#ef4444'
                                  }}
                                >
                                  M {quake.magnitude}
                                </span>
                              </div>
                              <p className="font-semibold text-gray-800 text-lg">{quake.location}</p>
                              <p className="text-sm text-gray-600 mt-1">{quake.note}</p>
                            </div>
                            <span className="text-blue-600 text-xl ml-4">→</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default EducationalFeatures

