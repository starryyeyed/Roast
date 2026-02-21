import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { getMeeting } from '../utils/store';
import { formatSlot } from '../utils/timeSlots';
import { fetchNearbyCafes, getUserLocation } from '../utils/cafes';
import { T, btnGhost } from '../utils/theme';

// Fix default leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function ConfirmationPage({ meetingId, session, onBack }) {
  const meeting = getMeeting(meetingId);
  const [cafe, setCafe] = useState(null);
  const [location, setLocation] = useState(null);

  const isHost = meeting?.hostId === session.id;
  const otherName = isHost ? meeting?.guestName : meeting?.hostName;
  const otherLinkedIn = isHost ? meeting?.guestLinkedIn : meeting?.hostLinkedIn;

  useEffect(() => {
    async function findCafe() {
      if (!meeting?.agreedCafe) return;
      const loc = await getUserLocation();
      setLocation(loc);
      const cafes = await fetchNearbyCafes(loc.lat, loc.lng);
      const found = cafes.find(c => c.id === meeting.agreedCafe);
      setCafe(found || cafes[0]);
    }
    findCafe();
  }, [meeting]);

  if (!meeting?.agreedCafe) {
    return (
      <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
        <div style={{ fontFamily: T.fontDisplay, fontSize: '28px', color: T.cream, marginBottom: '10px' }}>Waiting for a match…</div>
        <div style={{ color: T.creamDim, fontSize: '14px', lineHeight: '1.7', marginBottom: '28px' }}>
          Both of you need to finish swiping<br />and like at least one cafe in common.
        </div>
        <button style={btnGhost} onClick={onBack}>← Back</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: T.bg, paddingBottom: '60px' }}>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: `linear-gradient(180deg, ${T.ember} 0%, #8B3A1C 100%)`,
          padding: '40px 24px 36px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-30px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
          style={{ fontSize: '56px', marginBottom: '12px' }}
        >☕</motion.div>
        <div style={{ fontFamily: T.fontDisplay, fontSize: '36px', color: 'white', marginBottom: '6px', letterSpacing: '-0.5px' }}>
          You're on!
        </div>
        <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '15px' }}>
          You and {otherName} are meeting for coffee
        </div>
      </motion.div>

      <div style={{ padding: '28px 20px', maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Time card */}
        {meeting.agreedTime && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: T.emberGlow, border: `1px solid ${T.emberDim}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>📅</div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '600', color: T.creamDim, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>When</div>
              <div style={{ color: T.cream, fontSize: '15px', fontWeight: '600' }}>{formatSlot(meeting.agreedTime)}</div>
            </div>
          </motion.div>
        )}

        {/* Cafe card */}
        {cafe && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: '16px', overflow: 'hidden' }}
          >
            <img src={cafe.image} alt={cafe.name} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
            <div style={{ padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ fontFamily: T.fontDisplay, fontSize: '20px', color: T.cream }}>{cafe.name}</div>
                <span style={{ color: T.gold, fontSize: '14px', fontWeight: '600', flexShrink: 0, marginLeft: '8px' }}>★ {cafe.rating}</span>
              </div>
              <div style={{ color: T.creamDim, fontSize: '13px', marginBottom: '6px' }}>{cafe.address}</div>
              <div style={{ color: T.creamDim, fontSize: '12px' }}>🕐 {cafe.hours}</div>
            </div>
          </motion.div>
        )}

        {/* Map */}
        {cafe && location && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ borderRadius: '16px', overflow: 'hidden', border: `1px solid ${T.border}` }}
          >
            <MapContainer
              center={[cafe.lat, cafe.lon]}
              zoom={15}
              style={{ height: '220px', width: '100%' }}
              scrollWheelZoom={false}
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© OpenStreetMap'
              />
              <Marker position={[cafe.lat, cafe.lon]}>
                <Popup>{cafe.name}</Popup>
              </Marker>
            </MapContainer>
          </motion.div>
        )}

        {/* Other person card */}
        {otherName && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: '16px', padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: T.emberDim, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
              {otherName[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: T.cream, fontWeight: '600', fontSize: '14px', marginBottom: '2px' }}>{otherName}</div>
              {otherLinkedIn && (
                <div style={{ color: T.creamDim, fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{otherLinkedIn}</div>
              )}
            </div>
            {otherLinkedIn && (
              <motion.a
                href={otherLinkedIn.startsWith('http') ? otherLinkedIn : `https://${otherLinkedIn}`}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.05 }}
                style={{ background: '#0077B5', color: 'white', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', fontWeight: '600', fontFamily: T.fontUI, textDecoration: 'none', flexShrink: 0 }}
              >
                LinkedIn
              </motion.a>
            )}
          </motion.div>
        )}

        <button style={btnGhost} onClick={onBack}>← Back to meetings</button>
      </div>
    </div>
  );
}