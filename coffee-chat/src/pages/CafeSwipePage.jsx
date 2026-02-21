import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
import { getMeeting, saveCafeLikes } from '../utils/store';
import { fetchNearbyCafes, getUserLocation } from '../utils/cafes';
import { formatSlot } from '../utils/timeSlots';
import { T, btnPrimary } from '../utils/theme';

function CafeCard({ cafe, onSwipe, isTop }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-22, 22]);
  const yesOpacity = useTransform(x, [20, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, -20], [1, 0]);

  async function handleDragEnd(_, info) {
    if (info.offset.x > 110) {
      await animate(x, 700, { duration: 0.3 });
      onSwipe('right', cafe);
    } else if (info.offset.x < -110) {
      await animate(x, -700, { duration: 0.3 });
      onSwipe('left', cafe);
    } else {
      animate(x, 0, { type: 'spring', stiffness: 300, damping: 22 });
    }
  }

  return (
    <motion.div
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      style={{
        x, rotate,
        position: 'absolute', width: '100%', maxWidth: '360px', height: '480px',
        borderRadius: '20px', overflow: 'hidden', cursor: isTop ? 'grab' : 'default',
        background: T.bgCard, border: `1px solid ${T.border}`,
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
      }}
      onDragEnd={handleDragEnd}
      whileTap={isTop ? { cursor: 'grabbing' } : {}}
    >
      <img src={cafe.image} alt={cafe.name} style={{ width: '100%', height: '280px', objectFit: 'cover', pointerEvents: 'none' }} draggable={false} />
      <div style={{ padding: '18px 20px' }}>
        <div style={{ fontFamily: T.fontDisplay, fontSize: '22px', color: T.cream, marginBottom: '4px' }}>{cafe.name}</div>
        <div style={{ color: T.creamDim, fontSize: '13px', marginBottom: '10px' }}>{cafe.address}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <span style={{ color: T.gold, fontSize: '13px', fontWeight: '600' }}>★ {cafe.rating}</span>
          <span style={{ color: T.creamDim, fontSize: '12px' }}>{cafe.hours}</span>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {cafe.tags.map(t => (
            <span key={t} style={{ fontSize: '11px', background: T.creamFaint, color: T.creamDim, padding: '3px 10px', borderRadius: '20px' }}>{t}</span>
          ))}
        </div>
      </div>

      {isTop && (
        <>
          <motion.div style={{
            position: 'absolute', top: '24px', left: '20px',
            background: T.ember, color: 'white', fontFamily: T.fontDisplay,
            fontSize: '26px', padding: '6px 16px', borderRadius: '8px',
            transform: 'rotate(-10deg)', opacity: yesOpacity, pointerEvents: 'none',
          }}>YES ☕</motion.div>
          <motion.div style={{
            position: 'absolute', top: '24px', right: '20px',
            background: '#333', color: T.creamDim, fontFamily: T.fontDisplay,
            fontSize: '26px', padding: '6px 16px', borderRadius: '8px',
            transform: 'rotate(10deg)', opacity: nopeOpacity, pointerEvents: 'none',
          }}>NOPE</motion.div>
        </>
      )}
    </motion.div>
  );
}

export default function CafeSwipePage({ meetingId, session, onDone }) {
  const [cafes, setCafes] = useState([]);
  const [index, setIndex] = useState(0);
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);

  const meeting = getMeeting(meetingId);
  const isHost = meeting?.hostId === session.id;
  const agreedTime = meeting?.agreedTime;
  const otherName = isHost ? meeting?.guestName : meeting?.hostName;

  useEffect(() => {
    async function load() {
      setLoading(true);
      const loc = await getUserLocation();
      const results = await fetchNearbyCafes(loc.lat, loc.lng);
      setCafes(results);
      setLoading(false);
    }
    load();
  }, []);

  function handleSwipe(direction, cafe) {
    const newLikes = direction === 'right' ? [...likes, cafe.id] : likes;
    setLikes(newLikes);
    const nextIndex = index + 1;
    setIndex(nextIndex);

    if (nextIndex >= cafes.length) {
      const result = saveCafeLikes(meetingId, session.id, newLikes);
      onDone(result);
    }
  }

  async function handleBtn(direction) {
    if (index >= cafes.length) return;
    handleSwipe(direction, cafes[index]);
  }

  const remaining = cafes.length - index;
  const isDone = index >= cafes.length;

  return (
    <div style={{ minHeight: '100vh', background: T.bg, paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ fontFamily: T.fontDisplay, fontSize: '26px', color: T.cream }}>Pick a spot</div>
        <div style={{ color: T.creamDim, fontSize: '13px', marginTop: '3px' }}>
          {otherName && `${otherName} is also swiping — `}swipe right on places you'd go
        </div>
        {agreedTime && (
          <div style={{ marginTop: '10px', background: T.emberGlow, border: `1px solid ${T.emberDim}`, borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: T.ember }}>
            📅 You're both free: <strong>{formatSlot(agreedTime)}</strong>
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
          <div style={{ color: T.creamDim, fontSize: '14px' }}>Finding cafes near you…</div>
        </div>
      ) : isDone ? (
        <div style={{ textAlign: 'center', padding: '80px 32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>☕</div>
          <div style={{ fontFamily: T.fontDisplay, fontSize: '28px', color: T.cream, marginBottom: '10px' }}>All done!</div>
          <div style={{ color: T.creamDim, fontSize: '14px', lineHeight: '1.7' }}>
            You liked {likes.length} spot{likes.length !== 1 ? 's' : ''}.<br />
            Waiting for {otherName || 'them'} to finish…
          </div>
        </div>
      ) : (
        <>
          {/* Deck */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '28px 20px 16px', position: 'relative' }}>
            <div style={{ position: 'relative', width: '360px', height: '480px' }}>
              {index + 1 < cafes.length && (
                <div style={{ position: 'absolute', width: '100%', maxWidth: '360px', height: '480px', borderRadius: '20px', background: T.bgElevated, transform: 'scale(0.94) translateY(10px)', zIndex: 0, border: `1px solid ${T.border}` }} />
              )}
              <AnimatePresence>
                <CafeCard key={cafes[index]?.id} cafe={cafes[index]} onSwipe={handleSwipe} isTop={true} />
              </AnimatePresence>
            </div>
          </div>

          {/* Counter */}
          <div style={{ textAlign: 'center', color: T.creamDim, fontSize: '12px', fontFamily: T.fontMono, marginBottom: '16px' }}>
            {remaining} left · {likes.length} liked
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '0 20px' }}>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => handleBtn('left')}
              style={{ width: '60px', height: '60px', borderRadius: '50%', background: T.bgElevated, border: `1px solid ${T.border}`, color: T.creamDim, fontSize: '22px', cursor: 'pointer' }}
            >✕</motion.button>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => handleBtn('right')}
              style={{ width: '68px', height: '68px', borderRadius: '50%', background: T.ember, border: 'none', color: 'white', fontSize: '26px', cursor: 'pointer', boxShadow: `0 6px 24px ${T.emberDim}` }}
            >☕</motion.button>
          </div>
        </>
      )}
    </div>
  );
}