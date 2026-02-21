import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateChatMessage } from '../utils/matchEngine';

const styles = {
  card: {
    background: '#FAF7F2',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(44, 24, 16, 0.08)',
    border: '1px solid rgba(200, 149, 108, 0.2)',
    marginBottom: '16px',
  },
  header: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  avatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #C8956C',
    flexShrink: 0,
  },
  info: {
    flex: 1,
  },
  name: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '19px',
    fontWeight: '700',
    color: '#2C1810',
    marginBottom: '2px',
  },
  role: {
    fontSize: '13px',
    color: '#C8956C',
    fontWeight: '500',
    marginBottom: '4px',
  },
  school: {
    fontSize: '12px',
    color: '#8B6355',
  },
  compatBadge: {
    background: 'linear-gradient(135deg, #C8956C, #8B4513)',
    color: 'white',
    borderRadius: '20px',
    padding: '4px 12px',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    alignSelf: 'flex-start',
  },
  bio: {
    fontSize: '13px',
    color: '#6B4F44',
    lineHeight: '1.6',
    marginBottom: '14px',
    fontStyle: 'italic',
  },
  sharedSection: {
    marginBottom: '16px',
  },
  sharedLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#8B6355',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
  },
  cafeChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  cafeChip: {
    fontSize: '12px',
    background: 'rgba(200, 149, 108, 0.15)',
    color: '#4A2C20',
    padding: '4px 12px',
    borderRadius: '20px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  reachOutBtn: {
    flex: 1,
    background: 'linear-gradient(135deg, #C8956C, #8B4513)',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },
  linkedInBtn: {
    background: '#0077B5',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    whiteSpace: 'nowrap',
  },
  messageModal: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(44, 24, 16, 0.5)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: '0 0 0 0',
  },
  messagePanel: {
    background: '#FAF7F2',
    borderRadius: '24px 24px 0 0',
    padding: '28px 24px',
    width: '100%',
    maxWidth: '480px',
    maxHeight: '80vh',
    overflow: 'auto',
  },
  messageTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '20px',
    color: '#2C1810',
    marginBottom: '16px',
  },
  textarea: {
    width: '100%',
    minHeight: '200px',
    background: 'white',
    border: '1.5px solid rgba(200, 149, 108, 0.4)',
    borderRadius: '12px',
    padding: '14px',
    fontSize: '13px',
    fontFamily: "'DM Sans', sans-serif",
    color: '#2C1810',
    lineHeight: '1.6',
    resize: 'vertical',
    marginBottom: '14px',
  },
  copyBtn: {
    width: '100%',
    background: 'linear-gradient(135deg, #C8956C, #8B4513)',
    color: 'white',
    border: 'none',
    padding: '14px',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    marginBottom: '10px',
  },
  closeBtn: {
    width: '100%',
    background: 'transparent',
    color: '#8B6355',
    border: '1.5px solid rgba(200, 149, 108, 0.4)',
    padding: '12px',
    borderRadius: '12px',
    fontSize: '14px',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },
  copiedToast: {
    background: '#4CAF50',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    textAlign: 'center',
    marginBottom: '10px',
  }
};

export default function AlumniCard({ alumnus }) {
  const [showMessage, setShowMessage] = useState(false);
  const [copied, setCopied] = useState(false);
  const [messageText, setMessageText] = useState('');

  function handleReachOut() {
    const firstCafe = alumnus.sharedCafes[0] || '';
    const msg = generateChatMessage(alumnus, firstCafe.replace(/_/g, ' '));
    setMessageText(msg);
    setShowMessage(true);
    setCopied(false);
  }

  function handleCopy() {
    navigator.clipboard.writeText(messageText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  }

  function formatCafeName(id) {
    return id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  return (
    <>
      <motion.div
        style={styles.card}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div style={styles.header}>
          <img src={alumnus.avatar} alt={alumnus.name} style={styles.avatar} />
          <div style={styles.info}>
            <div style={styles.name}>{alumnus.name}</div>
            <div style={styles.role}>{alumnus.role}</div>
            <div style={styles.school}>{alumnus.school} · '{alumnus.graduation.slice(-2)}</div>
          </div>
          <div style={styles.compatBadge}>
            {alumnus.compatibilityPercent}% match
          </div>
        </div>

        <p style={styles.bio}>"{alumnus.bio}"</p>

        <div style={styles.sharedSection}>
          <div style={styles.sharedLabel}>☕ Shared Cafe Taste</div>
          <div style={styles.cafeChips}>
            {alumnus.sharedCafes.map(cafe => (
              <span key={cafe} style={styles.cafeChip}>
                ✓ {formatCafeName(cafe)}
              </span>
            ))}
          </div>
        </div>

        <div style={styles.actions}>
          <motion.button
            style={styles.reachOutBtn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleReachOut}
          >
            💬 Send Coffee Chat Request
          </motion.button>
          <motion.button
            style={styles.linkedInBtn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.open(`https://${alumnus.linkedIn}`, '_blank')}
          >
            in
          </motion.button>
        </div>
      </motion.div>

      {/* Message Modal */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            style={styles.messageModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowMessage(false); }}
          >
            <motion.div
              style={styles.messagePanel}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div style={styles.messageTitle}>
                Message to {alumnus.name.split(' ')[0]}
              </div>

              {copied && <div style={styles.copiedToast}>✓ Copied to clipboard!</div>}

              <textarea
                style={styles.textarea}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />

              <button style={styles.copyBtn} onClick={handleCopy}>
                Copy Message
              </button>
              <button style={styles.closeBtn} onClick={() => setShowMessage(false)}>
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}