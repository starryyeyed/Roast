import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix default Leaflet marker icons (known issue with Webpack)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom caramel-colored marker for liked cafes
const likedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// User location marker (blue)
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 14);
  }, [center, map]);
  return null;
}

const styles = {
  wrapper: {
    borderRadius: '20px',
    overflow: 'hidden',
    border: '1.5px solid rgba(200, 149, 108, 0.25)',
    boxShadow: '0 4px 20px rgba(44, 24, 16, 0.1)',
  },
  legend: {
    display: 'flex',
    gap: '16px',
    padding: '12px 16px',
    background: '#FAF7F2',
    fontSize: '12px',
    color: '#6B4F44',
    borderTop: '1px solid rgba(200, 149, 108, 0.2)',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  dot: (color) => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: color,
    flexShrink: 0,
  })
};

export default function CafeMap({ cafes, location, likedCafeIds = [] }) {
  if (!location) {
    return (
      <div style={{ ...styles.wrapper, height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0EAE0' }}>
        <span style={{ color: '#8B6355' }}>Loading map…</span>
      </div>
    );
  }

  const center = [location.lat, location.lng];

  return (
    <div style={styles.wrapper}>
      <MapContainer
        center={center}
        zoom={14}
        style={{ height: '320px', width: '100%' }}
        scrollWheelZoom={false}
      >
        <RecenterMap center={center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location */}
        <Marker position={center} icon={userIcon}>
          <Popup>
            <strong>📍 You are here</strong>
          </Popup>
        </Marker>

        {/* Cafe markers */}
        {cafes.map(cafe => {
          const cafeId = cafe.matchId || cafe.id;
          const isLiked = likedCafeIds.includes(cafeId);
          return (
            <Marker
              key={cafe.id}
              position={[cafe.lat, cafe.lon]}
              icon={isLiked ? likedIcon : new L.Icon.Default()}
            >
              <Popup>
                <div style={{ fontFamily: "'DM Sans', sans-serif", minWidth: '160px' }}>
                  <strong style={{ fontSize: '14px', color: '#2C1810' }}>{cafe.name}</strong>
                  <br />
                  <span style={{ color: '#C8956C', fontSize: '12px' }}>
                    ★ {cafe.rating} · {cafe.priceLevel}
                  </span>
                  <br />
                  <span style={{ color: '#8B6355', fontSize: '11px' }}>{cafe.address}</span>
                  {isLiked && (
                    <div style={{ marginTop: '6px', color: '#4CAF50', fontSize: '12px', fontWeight: '600' }}>
                      ✓ You liked this!
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div style={styles.dot('#2196F3')} />
          Your location
        </div>
        <div style={styles.legendItem}>
          <div style={styles.dot('#F57C00')} />
          Cafes you liked
        </div>
        <div style={styles.legendItem}>
          <div style={styles.dot('#6B9EC4')} />
          Other nearby cafes
        </div>
      </div>
    </div>
  );
}