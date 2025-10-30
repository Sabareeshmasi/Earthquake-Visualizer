import { useRef, useEffect, useMemo, useState } from 'react'
import Globe from 'react-globe.gl'

function GlobeView({ earthquakes, onPointClick, autoRotate, targetLocation, enableClustering = true }) {
  const globeEl = useRef()
  const [countriesData, setCountriesData] = useState(null)
  const [regionsData, setRegionsData] = useState(null)
  const [labelsData, setLabelsData] = useState([])
  const [currentZoom, setCurrentZoom] = useState(2.5) // Default altitude
  const [showRegions, setShowRegions] = useState(false)
  const [currentCountry, setCurrentCountry] = useState(null)

  // Simple clustering algorithm - group nearby earthquakes
  const clusterData = (data, threshold = 2) => {
    if (!enableClustering || data.length < 10) return data
    
    const clusters = []
    const processed = new Set()
    
    data.forEach((point, i) => {
      if (processed.has(i)) return
      
      const cluster = [point]
      processed.add(i)
      
      // Find nearby points
      data.forEach((otherPoint, j) => {
        if (i === j || processed.has(j)) return
        
        // Calculate distance (simple approximation)
        const dLat = point.lat - otherPoint.lat
        const dLng = point.lng - otherPoint.lng
        const distance = Math.sqrt(dLat * dLat + dLng * dLng)
        
        if (distance < threshold) {
          cluster.push(otherPoint)
          processed.add(j)
        }
      })
      
      if (cluster.length > 1) {
        // Create cluster point
        const avgLat = cluster.reduce((sum, p) => sum + p.lat, 0) / cluster.length
        const avgLng = cluster.reduce((sum, p) => sum + p.lng, 0) / cluster.length
        const maxMag = Math.max(...cluster.map(p => p.magnitude))
        
        clusters.push({
          lat: avgLat,
          lng: avgLng,
          size: Math.min(cluster.length * 0.5, 15),
          color: maxMag >= 5 ? '#ef4444' : maxMag >= 3 ? '#f97316' : '#10b981',
          magnitude: maxMag,
          place: `${cluster.length} earthquakes`,
          time: Math.max(...cluster.map(p => p.time)),
          depth: cluster[0].depth,
          id: `cluster-${i}`,
          isCluster: true,
          count: cluster.length,
          points: cluster
        })
      } else {
        clusters.push(cluster[0])
      }
    })
    
    return clusters
  }

  // Process earthquake data with performance optimizations
  const globeData = useMemo(() => {
    const processed = earthquakes
      .map((earthquake) => {
        const coords = earthquake.geometry?.coordinates
        if (!coords || coords.length < 2) return null

        const [lng, lat, depth] = coords
        const { mag, place, time, title, url } = earthquake.properties || {}

        // Validate coordinates
        if (
          typeof lat !== 'number' ||
          typeof lng !== 'number' ||
          lat < -90 ||
          lat > 90 ||
          lng < -180 ||
          lng > 180
        ) {
          return null
        }

        const magnitude = mag ?? 0

        // Color by magnitude
        let color = '#10b981' // Green
        if (magnitude >= 5) {
          color = '#ef4444' // Red
        } else if (magnitude >= 3) {
          color = '#f97316' // Orange
        }

        return {
          lat,
          lng,
          size: magnitude > 0 ? magnitude * 0.5 : 1,
          color,
          magnitude,
          place: place || title || 'Unknown Location',
          time: time,
          depth: depth,
          url: url, // USGS detail page URL
          id: earthquake.id || `${time}-${lat}-${lng}`
        }
      })
      .filter(Boolean)

    // Apply clustering if enabled
    return enableClustering && processed.length > 20 
      ? clusterData(processed, 3)
      : processed
  }, [earthquakes, enableClustering])

  // Fly to target location
  useEffect(() => {
    if (globeEl.current && targetLocation) {
      const [lat, lng] = targetLocation
      try {
        // Smooth fly to location using globe's pointOfView
        const timer = setTimeout(() => {
          if (globeEl.current && globeEl.current.pointOfView) {
            globeEl.current.pointOfView(
              { lat, lng, altitude: 2.5 },
              1000 // Animation duration in ms
            )
          }
        }, 100)
        
        return () => clearTimeout(timer)
      } catch (e) {
        console.log('Fly to error:', e)
      }
    }
  }, [targetLocation])

  useEffect(() => {
    if (globeEl.current) {
      // Set auto-rotate
      if (autoRotate) {
        globeEl.current.controls().autoRotate = true
        globeEl.current.controls().autoRotateSpeed = 0.5
      } else {
        globeEl.current.controls().autoRotate = false
      }
    }
  }, [autoRotate])

  // Calculate centroid from GeoJSON coordinates
  const calculateCentroid = (coords, type) => {
    if (!coords || !coords.length) return [0, 0]
    
    let allCoords = []
    
    if (type === 'Polygon') {
      // Take the first ring (outer boundary)
      allCoords = coords[0] || []
    } else if (type === 'MultiPolygon') {
      // Combine all polygons
      coords.forEach(polygon => {
        if (polygon[0]) {
          allCoords = allCoords.concat(polygon[0])
        }
      })
    }
    
    if (allCoords.length === 0) return [0, 0]
    
    // Simple centroid calculation (average of all points)
    let sumLat = 0, sumLng = 0
    allCoords.forEach(coord => {
      const [lng, lat] = Array.isArray(coord) ? coord : [0, 0]
      sumLng += lng
      sumLat += lat
    })
    
    return [sumLng / allCoords.length, sumLat / allCoords.length]
  }

  // Continent data with approximate centroids
  const continents = [
    { name: 'Africa', lat: 8, lng: 20, size: 1.0 },
    { name: 'Asia', lat: 34, lng: 100, size: 1.0 },
    { name: 'Europe', lat: 54, lng: 15, size: 0.9 },
    { name: 'North America', lat: 45, lng: -100, size: 1.0 },
    { name: 'South America', lat: -15, lng: -60, size: 0.9 },
    { name: 'Australia', lat: -25, lng: 135, size: 0.9 },
    { name: 'Antarctica', lat: -75, lng: 0, size: 0.8 }
  ]

  // Load country borders GeoJSON (keep for borders, but labels will be continents)
  useEffect(() => {
    const loadCountries = async () => {
      try {
        // Using Natural Earth countries GeoJSON
        const response = await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
        if (!response.ok) {
          // Fallback to alternative source
          try {
            const fallbackResponse = await fetch('https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/data/countries.geojson')
            if (fallbackResponse.ok) {
              const data = await fallbackResponse.json()
              if (data.type === 'FeatureCollection' && data.features) {
                setCountriesData(data.features)
              }
              return
            }
          } catch (e) {
            console.log('Fallback also failed')
          }
          return
        }
        
        const data = await response.json()
        
        // Handle different GeoJSON formats
        let features = []
        if (data.type === 'FeatureCollection' && data.features) {
          features = data.features
        } else if (Array.isArray(data)) {
          features = data
        } else if (data.objects?.countries) {
          // Handle TopoJSON-like structure
          console.log('TopoJSON format detected but not fully supported')
          return
        }
        
        setCountriesData(features)
      } catch (error) {
        console.log('Error loading countries data:', error)
      }
    }
    
    loadCountries()
    
    // Set continent labels instead of country labels
    const continentLabels = continents.map(continent => ({
      lat: continent.lat,
      lng: continent.lng,
      text: continent.name,
      size: continent.size,
      color: '#ffffff',
      opacity: 1
    }))
    
    setLabelsData(continentLabels)
  }, [])

  // Load state/region boundaries for specific countries
  const loadRegionBoundaries = async (countryName, countryProps) => {
    // For now, we'll manually handle some major countries
    // In a production app, you'd load from a GeoJSON API
    const majorCountriesWithRegions = ['United States', 'United States of America', 'USA', 'Canada', 'India', 'Australia', 'Brazil', 'China', 'Russia', 'Germany', 'France']
    
    if (!majorCountriesWithRegions.some(name => 
      countryName.includes(name) || name.includes(countryName)
    )) {
      setRegionsData(null)
      return
    }
    
    // For demonstration, we'll create simplified regional boundaries
    // In production, load actual GeoJSON from a service like Natural Earth
    try {
      // Example: Load US states if available
      if (countryName.includes('United States') || countryName.includes('USA')) {
        // You would load actual state boundaries here
        // For now, we'll set a flag that states should be shown
        setRegionsData([]) // Placeholder - would contain actual state boundaries
      } else {
        setRegionsData(null)
      }
    } catch (error) {
      console.log('Error loading region boundaries:', error)
      setRegionsData(null)
    }
  }

  // Track zoom level (altitude) for dynamic label visibility - optimized with throttling
  useEffect(() => {
    if (!globeEl.current) return
    
    let lastZoom = 2.5
    let rafId = null
    let lastUpdate = 0
    const throttleMs = 100 // Throttle updates to every 100ms
    
    const updateZoom = (timestamp) => {
      const now = timestamp || Date.now()
      
      // Throttle updates to reduce re-renders
      if (now - lastUpdate < throttleMs) {
        rafId = requestAnimationFrame(updateZoom)
        return
      }
      lastUpdate = now
      
      try {
        const pov = globeEl.current.pointOfView()
        if (pov && typeof pov.altitude === 'number') {
          const newZoom = pov.altitude
          // Only update state if zoom changed significantly (0.1 threshold)
          if (Math.abs(newZoom - lastZoom) > 0.1) {
            setCurrentZoom(newZoom)
            setShowRegions(newZoom < 1.5)
            lastZoom = newZoom
          }
        }
      } catch (e) {
        // Ignore errors
      }
      
      rafId = requestAnimationFrame(updateZoom)
    }
    
    // Start tracking with requestAnimationFrame for smooth updates
    rafId = requestAnimationFrame(updateZoom)
    
    // Also listen to globe rotations/interactions (but throttled)
    const globe = globeEl.current
    let controlUpdatePending = false
    const onControlChange = () => {
      if (!controlUpdatePending) {
        controlUpdatePending = true
        requestAnimationFrame(() => {
          updateZoom()
          controlUpdatePending = false
        })
      }
    }
    
    if (globe) {
      const controls = globe.controls()
      if (controls) {
        controls.addEventListener('change', onControlChange)
      }
    }
    
    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      if (globe && globe.controls()) {
        globe.controls().removeEventListener('change', onControlChange)
      }
    }
  }, [globeEl.current])

  // Performance optimization: LOD and marker culling
  useEffect(() => {
    if (globeEl.current) {
      const timer = setTimeout(() => {
        try {
          const scene = globeEl.current.scene()
          if (scene) {
            scene.traverse((child) => {
              if (child.isMesh && child.material) {
                // Optimize material updates
                if (child.material.map) {
                  child.material.map.needsUpdate = true
                }
                child.material.needsUpdate = true
                
                // Frustum culling (already handled by Three.js)
                child.frustumCulled = true
              }
            })
          }
        } catch (e) {
          console.log('Globe enhancement:', e)
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [earthquakes])

  // Clear regions when zooming out
  useEffect(() => {
    if (currentZoom > 2 && regionsData) {
      setRegionsData(null)
      setCurrentCountry(null)
    }
  }, [currentZoom, regionsData])

  // Filter labels based on zoom level - for continents only (always visible when zoomed out)
  const visibleLabels = useMemo(() => {
    // Continent labels fade in when zoomed out and fade out when zoomed in close
    let labelOpacity = 0
    if (currentZoom > 2) {
      labelOpacity = 1 // Fully visible when zoomed out
    } else if (currentZoom > 1.5) {
      labelOpacity = (currentZoom - 1.5) / 0.5 // Fade in between 1.5 and 2
    } else if (currentZoom > 1.0) {
      labelOpacity = 0.5 // Partially visible when moderately zoomed
    } else {
      labelOpacity = 0 // Hidden when zoomed in close
    }
    
    return labelsData.map(label => ({
      ...label,
      opacity: Math.max(0, Math.min(1, labelOpacity))
    })).filter(label => label.opacity > 0.1)
  }, [labelsData, currentZoom])

  return (
    <Globe
      ref={globeEl}
      globeImageUrl="https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg"
      bumpImageUrl="https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png"
      backgroundImageUrl="https://unpkg.com/three-globe/example/img/night-sky.png"
      pointsData={globeData}
      pointLat="lat"
      pointLng="lng"
      pointColor="color"
      pointRadius={(d) => {
        if (d.isCluster) return d.size || 5
        return d.size || 1
      }}
      pointAltitude={(d) => (d.magnitude || 0) * 0.01}
      pointResolution={enableClustering && globeData.length < 50 ? 18 : 12}
      // Country borders (polygons) - combine with regions when zoomed in
      polygonsData={showRegions && regionsData ? [...(countriesData || []), ...regionsData] : (countriesData || [])}
      polygonAltitude={0.006}
      polygonCapColor="rgba(0, 0, 0, 0)"
      polygonSideColor="rgba(255, 255, 255, 0.2)"
      polygonStrokeColor={currentZoom > 1.5 ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.4)'}
      polygonStrokeWidth={1.5}
      polygonLabel={(d) => {
        const name = d.properties?.name || d.properties?.NAME || d.properties?.NAME_LONG || 'Unknown'
        return `<div style="
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          white-space: nowrap;
        ">${name}</div>`
      }}
      // Country name labels
      labelsData={visibleLabels}
      labelText="text"
      labelLat="lat"
      labelLng="lng"
      labelColor={(d) => d.color || '#ffffff'}
      labelSize={(d) => d.size || 0.5}
      labelResolution={3}
      labelAltitude={0.02}
      labelDotRadius={0}
      labelLabel={(d) => {
        const opacity = d.opacity || 0
        if (opacity < 0.1) return ''
        return `<div style="
          background: rgba(0,0,0,${0.8 * opacity});
          color: rgba(255,255,255,${opacity});
          padding: 6px 12px;
          border-radius: 6px;
          font-size: ${Math.max(14, 18 * opacity)}px;
          font-weight: 800;
          text-shadow: 2px 2px 5px rgba(0,0,0,0.95);
          white-space: nowrap;
          pointer-events: none;
          transition: opacity 0.3s ease;
          letter-spacing: 0.5px;
        ">${d.text}</div>`
      }}
      onPolygonHover={(polygon, prevPolygon) => {
        // Highlight country on hover
        if (polygon) {
          document.body.style.cursor = 'pointer'
        } else {
          document.body.style.cursor = 'default'
        }
      }}
      onPolygonClick={async (polygon) => {
        // Zoom to country on click and load regional boundaries
        if (polygon && globeEl.current) {
          const props = polygon.properties || {}
          const countryName = props.name || props.NAME || props.NAME_LONG || props.ADMIN
          
          const coords = polygon.geometry?.coordinates
          if (coords && coords.length > 0) {
            const [lng, lat] = calculateCentroid(coords, polygon.geometry.type)
            if (globeEl.current.pointOfView) {
              globeEl.current.pointOfView({ lat, lng, altitude: 1.2 }, 1000)
              setCurrentCountry(countryName)
              
              // Load state/region boundaries for major countries when zoomed in
              setTimeout(() => {
                loadRegionBoundaries(countryName, props)
              }, 1200)
            }
          }
        }
      }}
      onPointClick={(point) => {
        if (point.isCluster && point.points) {
          // Handle cluster click - show info about cluster
          onPointClick({
            ...point,
            place: `${point.count} earthquakes in this area`,
            magnitude: point.magnitude
          })
        } else {
          onPointClick(point)
        }
      }}
      pointLabel={(d) => `
        <div style="
          background: rgba(0,0,0,0.8);
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          max-width: 200px;
        ">
          <strong>${d.isCluster ? `${d.count} Earthquakes` : (d.place || 'Unknown')}</strong><br/>
          ${d.isCluster ? `Max Magnitude: ` : `Magnitude: `}<strong style="color: ${d.color}">${d.magnitude?.toFixed(1)}</strong>
        </div>
      `}
      pointLabelDotRadius={1.5}
      pointLabelDotOrientation="top"
      animate={true}
      enablePointerInteraction={true}
      showAtmosphere={false}
      showGraticules={false}
    />
  )
}

export default GlobeView
