import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getMeeting } from '../utils/store';
import AvailabilityPage from './AvailabilityPage';
import CafeSwipePage from './CafeSwipePage';
import ConfirmationPage from './ConfirmationPage';
import { T, btnGhost } from '../utils/theme';
import { formatSlot } from '../utils/timeSlots';

export default function MeetingPage({ meetingId, session, onBack }) {
  const [refresh, setRefresh] = useState(0);
  const meeting = getMeeting(meetingId);

  if (!meeting) {
    return (
      <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', gap: '16px' }}>
        <div style={{ color: T.creamDim }}>Meeting not found.</div>
        <button style={btnGhost} onClick={onBack}>← Back</button>
      </div>
    );
  }

  const isHost = meeting.hostId === session.id;
  const mySlots = isHost ? meeting.hostSlots : meeting.guestSlots;
  const hasSubmittedAvailability = mySlots?.length > 0;
  const myLikes = isHost ? meeting.hostLikes : meeting.guestLikes;
  const hasSwipedCafes = myLikes?.length > 0;

  function handleAvailabilityDone(updatedMeeting) {
    setRefresh(r => r + 1);
  }

  function handleSwipeDone(updatedMeeting) {
    setRefresh(r => r + 1);
  }

  // ── PENDING: waiting for other person to join ──────────────────────────────
  if (meeting.status === 'pending') {
    return (
      <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📨</div>
        <div style={{ fontFamily: T.fontDisplay, fontSize: '28px', color: T.cream, marginBottom: '10px' }}>Waiting for them</div>
        <div style={{ color: T.creamDim, fontSize: '14px', lineHeight: '1.7', marginBottom: '24px' }}>
          Share the code <span style={{ fontFamily: T.fontMono, color: T.ember, fontSize: '16px', fontWeight: '600' }}>{meeting.id}</span><br />
          with your connection so they can join.
        </div>
        <button style={btnGhost} onClick={onBack}>← Back to meetings</button>
      </div>
    );
  }

  // ── CONFIRMED ──────────────────────────────────────────────────────────────
  if (meeting.status === 'confirmed') {
    return <ConfirmationPage meetingId={meetingId} session={session} onBack={onBack} />;
  }

  // ── AVAILABILITY ───────────────────────────────────────────────────────────
  if (meeting.status === 'availability') {
    if (!hasSubmittedAvailability) {
      return <AvailabilityPage meetingId={meetingId} session={session} onDone={handleAvailabilityDone} />;
    }
    // Already submitted availability — show waiting screen
    const otherName = isHost ? meeting.guestName : meeting.hostName;
    const otherHasSubmitted = isHost ? meeting.guestSlots?.length > 0 : meeting.hostSlots?.length > 0;
    return (
      <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
        <div style={{ fontFamily: T.fontDisplay, fontSize: '28px', color: T.cream, marginBottom: '10px' }}>Availability saved!</div>
        <div style={{ color: T.creamDim, fontSize: '14px', lineHeight: '1.7', marginBottom: '24px' }}>
          {otherHasSubmitted
            ? 'Both submitted — checking for overlap…'
            : `Waiting for ${otherName || 'them'} to pick their times.`}
        </div>
        <button style={btnGhost} onClick={onBack}>← Back to meetings</button>
      </div>
    );
  }

  // ── SWIPING ────────────────────────────────────────────────────────────────
  if (meeting.status === 'swiping') {
    if (!hasSwipedCafes) {
      return <CafeSwipePage meetingId={meetingId} session={session} onDone={handleSwipeDone} />;
    }
    // Already swiped, waiting for other person + checking for mutual likes
    const otherName = isHost ? meeting.guestName : meeting.hostName;
    const otherHasSwiped = isHost ? meeting.guestLikes?.length > 0 : meeting.hostLikes?.length > 0;

    // If both swiped but no match found
    if (otherHasSwiped && !meeting.agreedCafe) {
      return (
        <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', textAlign: 'center', gap: '16px' }}>
          <div style={{ fontSize: '48px' }}>😬</div>
          <div style={{ fontFamily: T.fontDisplay, fontSize: '26px', color: T.cream }}>No overlap found</div>
          <div style={{ color: T.creamDim, fontSize: '14px', lineHeight: '1.7' }}>
            You and {otherName} didn't like any of the same spots.<br />
            Try swiping again with a looser filter.
          </div>
          <button style={{ ...btnGhost, maxWidth: '200px' }} onClick={onBack}>← Back</button>
        </div>
      );
    }

    return (
      <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>☕</div>
        <div style={{ fontFamily: T.fontDisplay, fontSize: '28px', color: T.cream, marginBottom: '10px' }}>Cafes saved!</div>
        <div style={{ color: T.creamDim, fontSize: '14px', lineHeight: '1.7', marginBottom: '24px' }}>
          {otherHasSwiped
            ? 'Both swiped — checking for a match…'
            : `Waiting for ${otherName || 'them'} to swipe on cafes.`}
          {meeting.agreedTime && (
            <><br /><span style={{ color: T.ember }}>You're both free: {formatSlot(meeting.agreedTime)}</span></>
          )}
        </div>
        <button style={btnGhost} onClick={onBack}>← Back to meetings</button>
      </div>
    );
  }

  return null;
}