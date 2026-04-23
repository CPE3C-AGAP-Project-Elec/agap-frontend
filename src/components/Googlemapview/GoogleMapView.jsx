// src/components/Googlemapview/GoogleMapView.jsx
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useState, useCallback } from 'react';

// Move libraries OUTSIDE component to prevent re-renders
const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '12px',
};

const defaultCenter = {
  lat: 14.5995,
  lng: 120.9842,
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
};

export default function GoogleMapView({ latitude, longitude, locationName, floodRiskLevel }) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Don't render if no coordinates
  if (!latitude || !longitude) {
    return (
      <div className="map-placeholder" style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: '12px',
        color: '#666'
      }}>
        <p>Enter a location to view the map</p>
      </div>
    );
  }

  const center = {
    lat: parseFloat(latitude),
    lng: parseFloat(longitude)
  };

  const getFloodRiskColor = (risk) => {
    switch (risk) {
      case 'high': return '#dc2626';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#2565a8';
    }
  };

  const onLoad = useCallback((map) => {
    console.log('Map loaded successfully');
    setMapLoaded(true);
  }, []);

  const onError = useCallback((error) => {
    console.error('Google Maps Error:', error);
  }, []);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Check if API key exists
  if (!apiKey) {
    return (
      <div className="map-placeholder" style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: '12px',
        color: '#dc2626',
        textAlign: 'center',
        padding: '20px'
      }}>
        <p>Google Maps API key is missing. Please add VITE_GOOGLE_MAPS_API_KEY to your environment variables.</p>
      </div>
    );
  }

  return (
    <LoadScript 
      googleMapsApiKey={apiKey} 
      onError={onError}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={12}
        options={mapOptions}
        onLoad={onLoad}
      >
        <Marker
          position={center}
          onClick={() => setSelectedLocation(center)}
          icon={{
            path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
            fillColor: getFloodRiskColor(floodRiskLevel),
            fillOpacity: 0.8,
            strokeWeight: 1,
            strokeColor: '#ffffff',
            scale: 1.5,
          }}
        />
        
        {selectedLocation && (
          <InfoWindow
            position={selectedLocation}
            onCloseClick={() => setSelectedLocation(null)}
          >
            <div style={{ padding: '4px 8px', minWidth: '150px' }}>
              <strong style={{ display: 'block', marginBottom: '5px' }}>
                {locationName || 'Selected Location'}
              </strong>
              {floodRiskLevel && (
                <p style={{ 
                  margin: 0, 
                  color: getFloodRiskColor(floodRiskLevel),
                  fontWeight: 'bold'
                }}>
                  Flood Risk: {floodRiskLevel.toUpperCase()}
                </p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}
