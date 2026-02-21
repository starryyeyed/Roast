import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createMeeting, getUserMeetings, joinMeeting } from '../utils/store';
import { T, btnPrimary, btnGhost, input, label, card } from '../utils/theme';

const STATUS_LABELS = {
  pending: { label: 'Waiting for them', color: T.gold },
  availability: { label: 'Pick your times', color: T.ember },
  swiping: { label: 'Swipe cafes', color: T.ember },
  confirmed: { label: '✓ Confirmed!', color: T.green },
};

export default function HomePage({ session, onOpenMeeting, onRefresh }) {
  const [showInvite, setShowInvite] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [inviteCode, setInviteCode] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const meetings = getUserMeetings(session.id);

  function handleInvite() {
    if (!linkedInUrl.includes('linkedin.com')) return setError('Enter a valid LinkedIn URL');
    const meeting = createMeeting(session, linkedInUrl.trim());
    setInviteCode(meeting.id);
    setError('');
  }

  function handleCopyCode() {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleJoin() {
    const code = joinCode.trim().toUpperCase();
    const result = joinMeeting(code, session);
    if (!result) return setError('Meeting code not found');
    setShowJoin(false);
    setJoinCode('');
    onRefresh();
    onOpenMeeting(code);
  }

  return (
    <div style={{ minHeight: '100vh', background: T.bg, padding: '0 0 40px' }}>
      {/* Header */}
      <div style={{ padding: '24px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: T.fontDisplay, fontSize: '32px', color: T.cream, lineHeight: 1 }}>Roast</div>
          <div style={{ color: T.creamDim, fontSize: '13px', marginTop: '3px' }}>
            Hey {session.name.split(' ')[0]} 👋
          </div>
        </div>
        <div style={{
          width: '38px', height: '38px', borderRadius: '50%',
          background: T.ember, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: T.fontDisplay, fontSize: '16px', color: 'white',
        }}>
          {session.name[0]}
        </div>
      </div>

      <div style={{ padding: '28px 20px', maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Action buttons */}
        <motion.button
          style={{ ...btnPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          whileHover={{ background: '#FF7043' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setShowInvite(true); setShowJoin(false); setInviteCode(null); setError(''); setLinkedInUrl(''); }}
        >
          + Invite a LinkedIn Connection
        </motion.button>
        <motion.button
          style={{ ...btnGhost, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          whileHover={{ borderColor: T.borderStrong }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setShowJoin(true); setShowInvite(false); setError(''); setJoinCode(''); }}
        >
          Enter a Meeting Code
        </motion.button>

        {/* Invite Modal */}
        <AnimatePresence>
          {showInvite && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '4px' }}>
                {!inviteCode ? (
                  <>
                    <div style={{ fontFamily: T.fontDisplay, fontSize: '20px', color: T.cream }}>
                      Who are you meeting?
                    </div>
                    <div>
                      <span style={label}>Their LinkedIn URL</span>
                      <input
                        style={input}
                        placeholder="linkedin.com/in/theirname"
                        value={linkedInUrl}
                        onChange={e => { setLinkedInUrl(e.target.value); setError(''); }}
                      />
                    </div>
                    {error && <div style={{ color: '#EF5350', fontSize: '13px' }}>{error}</div>}
                    <motion.button style={btnPrimary} whileTap={{ scale: 0.98 }} onClick={handleInvite}>
                      Generate Meeting Code →
                    </motion.button>
                    <button style={btnGhost} onClick={() => setShowInvite(false)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <div style={{ fontFamily: T.fontDisplay, fontSize: '20px', color: T.cream }}>
                      Share this code
                    </div>
                    <div style={{
                      background: T.bgElevated, borderRadius: '12px', padding: '20px',
                      textAlign: 'center', border: `1px solid ${T.border}`,
                    }}>
                      <div style={{ fontFamily: T.fontMono, fontSize: '36px', fontWeight: '500', color: T.ember, letterSpacing: '6px' }}>
                        {inviteCode}
                      </div>
                      <div style={{ color: T.creamDim, fontSize: '12px', marginTop: '8px' }}>
                        Send this to your connection
                      </div>
                    </div>
                    <motion.button
                      style={{ ...btnPrimary, background: copied ? T.green : T.ember }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCopyCode}
                    >
                      {copied ? '✓ Copied!' : 'Copy Code'}
                    </motion.button>
                    <button style={btnGhost} onClick={() => { setShowInvite(false); onRefresh(); }}>Done</button>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {showJoin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '4px' }}>
                <div style={{ fontFamily: T.fontDisplay, fontSize: '20px', color: T.cream }}>
                  Enter a Meeting Code
                </div>
                <input
                  style={{ ...input, fontFamily: T.fontMono, fontSize: '24px', textAlign: 'center', letterSpacing: '4px', textTransform: 'uppercase' }}
                  placeholder="ABC123"
                  value={joinCode}
                  maxLength={6}
                  onChange={e => { setJoinCode(e.target.value.toUpperCase()); setError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleJoin()}
                />
                {error && <div style={{ color: '#EF5350', fontSize: '13px' }}>{error}</div>}
                <motion.button style={btnPrimary} whileTap={{ scale: 0.98 }} onClick={handleJoin}>
                  Join Meeting →
                </motion.button>
                <button style={btnGhost} onClick={() => setShowJoin(false)}>Cancel</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Meetings list */}
        {meetings.length > 0 && (
          <div style={{ marginTop: '8px' }}>
            <div style={{ ...label, marginBottom: '12px' }}>Your Meetings</div>
            {meetings.map(m => {
              const status = STATUS_LABELS[m.status] || STATUS_LABELS.pending;
              const otherName = m.hostId === session.id ? m.guestName : m.hostName;
              return (
                <motion.div
                  key={m.id}
                  whileHover={{ borderColor: T.borderStrong }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onOpenMeeting(m.id)}
                  style={{
                    ...card, padding: '16px 18px',
                    display: 'flex', alignItems: 'center', gap: '14px',
                    cursor: 'pointer', marginBottom: '8px', transition: 'border-color 0.2s',
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: T.emberDim, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                    ☕
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: T.cream, fontWeight: '600', fontSize: '14px', marginBottom: '3px' }}>
                      {otherName ? `With ${otherName}` : 'Waiting for connection…'}
                    </div>
                    <div style={{ fontFamily: T.fontMono, fontSize: '11px', color: T.creamDim }}>
                      Code: {m.id}
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: status.color, flexShrink: 0 }}>
                    {status.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {meetings.length === 0 && !showInvite && !showJoin && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: T.creamDim, fontSize: '14px', lineHeight: '1.7' }}>
            No meetings yet.<br />
            Invite a LinkedIn connection to get started.
          </div>
        )}
      </div>
    </div>
  );
}