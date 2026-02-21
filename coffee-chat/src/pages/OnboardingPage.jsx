import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createSession } from '../utils/store';
import { T, btnPrimary, input, label } from '../utils/theme';

export default function OnboardingPage({ onDone }) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  function handleSubmit() {
    if (!name.trim()) return setError('Enter your name');
    if (!url.includes('linkedin.com')) return setError('Enter a valid LinkedIn URL');
    const session = createSession(name.trim(), url.trim());
    onDone(session);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', background: T.bg }}>
      {/* Grain overlay */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")', pointerEvents: 'none', zIndex: 0 }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: '100%', maxWidth: '400px', position: 'relative', zIndex: 1 }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>☕</div>
          <div style={{ fontFamily: T.fontDisplay, fontSize: '52px', color: T.cream, lineHeight: 1, letterSpacing: '-1px' }}>
            Roast
          </div>
          <div style={{ color: T.creamDim, fontSize: '14px', marginTop: '8px', fontFamily: T.fontUI }}>
            Coffee chats, sorted.
          </div>
        </div>

        {/* Form */}
        <div style={{ background: T.bgCard, border: `1px solid rgba(240,230,211,0.08)`, borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <span style={label}>Your Name</span>
            <input
              style={input}
              placeholder="e.g. Maya Chen"
              value={name}
              onChange={e => { setName(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>
          <div>
            <span style={label}>Your LinkedIn URL</span>
            <input
              style={input}
              placeholder="linkedin.com/in/yourname"
              value={url}
              onChange={e => { setUrl(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
            <div style={{ fontSize: '11px', color: T.creamDim, marginTop: '6px' }}>
              This is how your connection will recognize you.
            </div>
          </div>

          {error && (
            <div style={{ color: '#EF5350', fontSize: '13px', background: 'rgba(239,83,80,0.1)', padding: '10px 14px', borderRadius: '8px' }}>
              {error}
            </div>
          )}

          <motion.button
            style={btnPrimary}
            whileHover={{ background: '#FF7043' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
          >
            Get Started →
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}