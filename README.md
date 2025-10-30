# 🌍 3D Earthquake Visualizer

An interactive 3D visualization of recent global earthquake activity using React and Three.js. Experience earthquakes in real-time on a beautiful, rotatable 3D globe.

## ✨ Features

- **3D Interactive Globe**: Rotate, zoom, and explore earthquake locations on a stunning 3D Earth
- **Real-Time Data**: Fetches latest earthquake data from USGS API (last 24 hours)
- **Color-Coded Markers**: Visual representation based on earthquake magnitude
  - 🟢 Green: Magnitude < 3 (Minor)
  - 🟠 Orange: Magnitude 3-5 (Moderate)
  - 🔴 Red: Magnitude > 5 (Strong)
- **Marker Size Scaling**: Marker size scales with magnitude
- **Auto-Rotation**: Toggle automatic globe rotation on/off
- **Interactive Popups**: Click markers to view detailed earthquake information
- **Clickable Markers**: Hover to see preview, click for full details
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Theme**: Beautiful night sky background with Earth imagery

## 🛠 Technology Stack

- **Framework**: React 18 (Functional Components + Hooks)
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **3D Visualization**: React-Globe.gl 2.31 (Three.js based)
- **3D Engine**: Three.js 0.160
- **State Management**: React built-in hooks (`useState`, `useEffect`)
- **API**: USGS Earthquake API (no authentication required)

## 🚀 Installation

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn package manager

### Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## 📖 Usage

### Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### How to Use the App

1. **Explore the Globe**: 
   - **Drag** to rotate the globe
   - **Scroll** to zoom in/out
   - **Auto-Rotate**: Click the "Auto Rotate ON/OFF" button to toggle automatic rotation

2. **View Earthquakes**: 
   - Colored markers appear on the globe at earthquake locations
   - **Hover** over markers to see a preview tooltip
   - **Click** markers to view detailed information in the info card

3. **Refresh Data**: Click the "🔄 Refresh Data" button to fetch the latest earthquake data

4. **Close Info Card**: Click anywhere on the globe or the × button to close the info card

## 📁 Project Structure

```
EarthQuack/
├── src/
│   ├── components/
│   │   ├── GlobeView.jsx      # 3D Globe component with earthquake markers
│   │   ├── InfoCard.jsx        # Earthquake detail card
│   │   └── Legend.jsx         # Magnitude scale legend
│   ├── App.jsx                 # Main application component
│   ├── main.jsx                # React entry point
│   └── index.css               # Tailwind CSS + custom styles
├── index.html                  # HTML template
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
└── README.md                   # This file
```

## 🔍 Key Features Explained

### 1. 3D Globe Visualization

The app uses `react-globe.gl` to render an interactive 3D Earth model:
- Earth texture with realistic appearance
- Night sky background
- Smooth animations and transitions
- WebGL-powered rendering for performance

### 2. Marker System

- **Positioning**: Uses latitude/longitude from USGS GeoJSON data
- **Color Coding**: Automatic color assignment based on magnitude
- **Size Scaling**: Markers scale with magnitude (mag × 0.5)
- **Altitude**: Markers float above the surface proportional to magnitude

### 3. API Integration

Uses the USGS Earthquake API endpoint:
```
https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson
```

This endpoint provides earthquake data from the last 24 hours in GeoJSON format.

### 4. Interactive Controls

- **Rotation**: Click and drag to rotate the globe in any direction
- **Zoom**: Scroll wheel to zoom in/out
- **Auto-Rotate**: Smooth automatic rotation when enabled
- **Marker Selection**: Click markers for detailed information

## 🌐 API Information

### USGS Earthquake API

**Endpoint**: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson`

**API Reference**: [USGS Earthquake API Documentation](https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson)

**Features**:
- ✅ No authentication required
- ✅ Free and publicly available
- ✅ Updates in real-time (provides last 24 hours of data)
- ✅ Returns GeoJSON format
- ✅ Returns approximately 100-200 earthquakes per day globally

**Response Format** (GeoJSON FeatureCollection):
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "mag": 4.5,
        "place": "Location Name",
        "time": 1234567890
      },
      "geometry": {
        "coordinates": [longitude, latitude, depth]
      }
    }
  ]
}
```

## 🚢 Deployment

### Option 1: CodeSandbox

1. Go to [codesandbox.io](https://codesandbox.io)
2. Click "Import from GitHub" or create new project
3. Upload your project files
4. CodeSandbox will automatically install dependencies
5. Share the live URL

### Option 2: StackBlitz

1. Go to [stackblitz.com](https://stackblitz.com)
2. Click "New Project" → "Import from GitHub" or upload files
3. StackBlitz will automatically set up the environment
4. Your app will be live instantly

### Option 3: Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project directory
3. Follow prompts to deploy

### Option 4: Netlify

1. Build the project: `npm run build`
2. Drag the `dist` folder to [netlify.com/drop](https://app.netlify.com/drop)
3. Or use Netlify CLI: `netlify deploy --prod --dir=dist`

## 🎯 Controls

- **Rotate Globe**: Click and drag anywhere on the globe
- **Zoom**: Scroll mouse wheel (desktop) or pinch (mobile)
- **Auto-Rotate**: Toggle button in header
- **Select Marker**: Click on any earthquake marker
- **Close Info**: Click anywhere on globe or × button

## 🎨 Customization

### Marker Colors

Edit `src/components/GlobeView.jsx` to change color scheme:

```javascript
// Color by magnitude
let color = '#10b981' // Green
if (magnitude >= 5) {
  color = '#ef4444' // Red
} else if (magnitude >= 3) {
  color = '#f97316' // Orange
}
```

### Marker Size

Adjust the scaling factor:

```javascript
size: magnitude > 0 ? magnitude * 0.5 : 1, // Change 0.5 to adjust
```

## 📝 Notes

- The globe uses WebGL for hardware-accelerated rendering
- Markers are rendered as 3D spheres on the globe surface
- Point labels appear on hover for quick information
- The app is fully responsive and works on mobile devices
- Auto-rotation provides smooth, continuous globe movement

## 🐛 Troubleshooting

**Globe not showing?**
- Ensure WebGL is supported in your browser
- Check browser console for errors
- Try refreshing the page

**Markers not appearing?**
- Check if API data is loading (see console)
- Verify earthquake data contains valid coordinates
- Check browser console for rendering errors

**Performance issues?**
- Reduce `pointResolution` in GlobeView.jsx
- Limit the number of earthquakes displayed
- Update to latest browser version

## 📄 License

This project is open source and available for educational purposes.

## 👤 Author

Built with ❤️ using React + Three.js + Globe.gl

---

**Note**: This application uses the USGS Earthquake API which is a free, public service. No API keys or registration required.

**3D Globe Visualization**: Powered by [react-globe.gl](https://github.com/vasturiano/react-globe.gl) and [Three.js](https://threejs.org/)
