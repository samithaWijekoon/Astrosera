import React, { useMemo } from 'react';
import { threatLevel, fmtKm, fmtDiam } from '../../services/helpers';
import OrbitalViz from './OrbitalViz';
import BellButton from './BellButton';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '200px',
  borderRadius: '0.5rem',
  marginTop: '0.5rem'
};

const cityCoords = {
  'New York': { lat: 40.7128, lng: -74.0060 },
  'London':   { lat: 51.5074, lng: -0.1278 },
  'Tokyo':    { lat: 35.6762, lng: 139.6503 },
  'Sydney':   { lat: -33.8688, lng: 151.2093 },
  'Paris':    { lat: 48.8566, lng: 2.3522 },
  'Berlin':   { lat: 52.5200, lng: 13.4050 },
  'Global':   { lat: 0, lng: 0 }
};

// Astrosera Dark Mode map styles
const mapStyles = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }]
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }]
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }]
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }]
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }]
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }]
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }]
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }]
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }]
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }]
  }
];

export default function AsteroidDetail({ neo, onClose }) {
  const threat    = threatLevel(neo);
  const cleanName = neo.name.replace(/^\(|\)$/g, '');
  
  const mapCenter = useMemo(() => {
    return cityCoords[neo.viewingLocation] || cityCoords['Global'];
  }, [neo.viewingLocation]);

  return (
    <div className="bg-gray-900/80 border border-purple-900/40 rounded-xl p-5 sticky top-24 max-h-[80vh] overflow-y-auto w-full max-w-sm">
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-purple-400 font-mono text-sm font-bold pr-4 break-words">{neo.name}</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-white text-lg leading-none flex-shrink-0">✕</button>
      </div>
      <p className="text-yellow-400/70 text-xs italic mb-3">{cleanName}</p>

      <span className="inline-block text-xs px-2 py-0.5 rounded border mb-4" style={{ color: threat.color, borderColor: threat.color + '55', background: threat.color + '15' }}>
        {threat.label}
      </span>

      <OrbitalViz neo={neo} />

      <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 mt-4 border-b border-gray-800 pb-1">Best Viewing Location</p>
      <div className="mb-4">
        <LoadScript googleMapsApiKey={import.meta.env.VITE_MAPS_API_KEY || ''}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={5}
            options={{
              styles: mapStyles,
              disableDefaultUI: true,
              zoomControl: true,
            }}
          >
            <Marker position={mapCenter} icon={{
              url: 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="%23a855f7"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
              scaledSize: new window.google.maps.Size(32, 32)
            }}/>
          </GoogleMap>
        </LoadScript>
        <div className="text-xs text-gray-400 mt-2 text-right">📍 {neo.viewingLocation || 'Global'}</div>
      </div>

      <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 border-b border-gray-800 pb-1">Telemetry</p>

      {[
        ['Approach',  neo.approachFull || neo.approachDate],
        ['Miss Dist', fmtKm(neo.missDistKm)],
        ['Lunar Dist',neo.missDistLunar.toFixed(2) + ' LD'],
        ['Velocity',  (neo.velocityKph / 3600).toFixed(2) + ' km/s'],
        ['Diameter',  fmtDiam(neo.diamMinKm, neo.diamMaxKm)],
        ['Hazardous', neo.isHazardous ? '⚠ YES' : 'NO'],
      ].map(([k, v]) => (
        <div key={k} className="flex justify-between py-2 border-b border-gray-800 last:border-0 hover:bg-white/5 px-1 rounded transition-colors">
          <span className="text-gray-500 text-xs uppercase tracking-wide">{k}</span>
          <span className={`font-mono text-xs ${k === 'Hazardous' && neo.isHazardous ? 'text-red-400 font-bold' : 'text-gray-300'}`}>{v}</span>
        </div>
      ))}

      <div className="flex gap-2 mt-5">
        <div className="flex-1">
          <BellButton asteroid={neo} />
        </div>
        <a href={neo.nasaJplUrl} target="_blank" rel="noreferrer"
          className="flex-1 text-center text-xs px-3 py-2 border border-purple-700 text-purple-400 rounded hover:bg-purple-700/20 transition-colors uppercase tracking-widest font-semibold font-mono">
          JPL DATA ↗
        </a>
      </div>
    </div>
  );
}
