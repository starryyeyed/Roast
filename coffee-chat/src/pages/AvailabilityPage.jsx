import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getMeeting, saveSlots } from '../utils/store';
import { getNextSevenDays, HOURS, slotKey } from '../utils/timeSlots';
import { T, btnPrimary, btnGhost, label } from '../utils/theme';

const DAYS = getNextSevenDays();

export default function AvailabilityPage({ meetingId, session, onDone }) {
  const meeting = getMeeting(meetingId);
  const isHost = meeting?.hostId === session.id;
  const mySlots = isHost ? meeting?.hostSlots || [] : meeting?.guestSlots || [];

  const [selected, setSelected] = useState(new Set(mySlots));
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState(null); // 'add' or 'remove'

  function toggleSlot(key) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function handleMouseDown(key) {
    setIsDragging(true);
    const adding = !selected.has(key);
    setDragMode(adding ? 'add' : 'remove');
    setSelected(prev => {
      const next = new Set(prev);
      if (adding) next.add(key);
      else next.delete(key);
      return next;
    });
  }

  function handleMouseEnter(key) {
    if (!isDragging) return;
    setSelected(prev => {
      const next = new Set(prev);
      if (dragMode === 'add') next.add(key);
      else next.delete(key);
      return next;
    });
  }

  function handleMouseUp() {
    setIsDragging(false);
    setDragMode(null);
  }

  function handleSubmit() {
    const slots = Array.from(selected);
    const result = saveSlots(meetingId, session.id, slots);
    onDone(result);
  }

  const otherName = isHost ? meeting?.guestName : meeting?.hostName;
  const otherHasSubmitted = isHost ? meeting?.guestSlots?.length > 0 : meeting?.hostSlots?.length > 0;
  const othersSlots = new Set(isHost ? meeting?.guestSlots || [] : meeting?.hostSlots || []);

  return (
    <div style={{ minHeight: '100vh', background: T.bg, paddingBottom: '120px' }}
      onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>

      {/* Header */}
      <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div>
          <div style={{ fontFamily: T.fontDisplay, fontSize: '26px', color: T.cream }}>When are you free?</div>
          <div style={{ color: T.creamDim, fontSize: '13px', marginTop: '2px' }}>
            {otherHasSubmitted
              ? `${otherName || 'They'} already picked times — overlap shown in orange`
              : `Drag to select your available slots`}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ padding: '14px 20px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {[
          { color: T.ember, label: 'You' },
          ...(otherHasSubmitted ? [{ color: '#7C4DFF', label: otherName || 'Them' }] : []),
          ...(otherHasSubmitted ? [{ color: T.gold, label: 'Both free ✓' }] : []),
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: T.creamDim }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: item.color }} />
            {item.label}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ overflowX: 'auto', padding: '0 20px' }}>
        <div style={{ minWidth: '500px' }}>
          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '48px repeat(7, 1fr)', gap: '3px', marginBottom: '3px' }}>
            <div />
            {DAYS.map(d => (
              <div key={d.key} style={{ textAlign: 'center', fontSize: '11px', color: T.creamDim, fontWeight: '600', padding: '4px 0', letterSpacing: '0.5px' }}>
                {d.short}<br />
                <span style={{ fontSize: '10px', fontFamily: T.fontMono }}>{d.key.slice(5)}</span>
              </div>
            ))}
          </div>

          {/* Time rows */}
          {HOURS.map(hour => (
            <div key={hour} style={{ display: 'grid', gridTemplateColumns: '48px repeat(7, 1fr)', gap: '3px', marginBottom: '3px' }}>
              <div style={{ fontSize: '10px', color: T.creamDim, textAlign: 'right', paddingRight: '8px', paddingTop: '6px', fontFamily: T.fontMono }}>
                {hour}
              </div>
              {DAYS.map(d => {
                const key = slotKey(d.key, hour);
                const mine = selected.has(key);
                const theirs = othersSlots.has(key);
                const both = mine && theirs;
                let bg = T.bgElevated;
                if (both) bg = T.gold;
                else if (mine) bg = T.ember;
                else if (theirs) bg = '#7C4DFF';

                return (
                  <div
                    key={key}
                    onMouseDown={() => handleMouseDown(key)}
                    onMouseEnter={() => handleMouseEnter(key)}
                    style={{
                      height: '32px', borderRadius: '5px',
                      background: bg,
                      border: `1px solid ${mine || theirs ? 'transparent' : T.border}`,
                      cursor: 'pointer',
                      transition: 'background 0.1s',
                      userSelect: 'none',
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'rgba(14,10,7,0.95)', backdropFilter: 'blur(12px)',
        borderTop: `1px solid ${T.border}`,
        padding: '16px 20px 24px',
        display: 'flex', flexDirection: 'column', gap: '10px',
        maxWidth: '480px', margin: '0 auto',
      }}>
        <div style={{ fontSize: '13px', color: T.creamDim, textAlign: 'center' }}>
          {selected.size} slot{selected.size !== 1 ? 's' : ''} selected
        </div>
        <motion.button
          style={{ ...btnPrimary, opacity: selected.size === 0 ? 0.4 : 1 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={selected.size === 0}
        >
          Submit Availability →
        </motion.button>
      </div>
    </div>
  );
}