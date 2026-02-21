import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CafeCard from './CafeCard';
import { saveSwipe } from '../utils/matchEngine';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '32px',
  },
  deckWrapper: {
    position: 'relative',
    width: '360px',
    height: '520px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundCard: {
    position: 'absolute',
    width: '100%',
    maxWidth: '360px',
    height: '520px',
    borderRadius: '24px',
    background: '#EDE5D8',
    transform: 'scale(0.95) translateY(8px)',
    zIndex: 1,
  },
  backgroundCard2: {
    position: 'absolute',
    width: '100%',
    maxWidth: '360px',
    height: '520px',
    borderRadius: '24px',
    background: '#E5D9CC',
    transform: 'scale(0.90) translateY(16px)',
    zIndex: 0,
  },
  buttons: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
  },
  passBtn: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    border: '2px solid #ef5350',
    background: 'white',
    color: '#ef5350',
    fontSize: '24px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    boxShadow: '0 4px 16px rgba(239, 83, 80, 0.2)',
  },
  likeBtn: {
    width: '68px',
    height: '68px',
    borderRadius: '50%',
    border: 'none',
    background: 'linear-gradient(135deg, #C8956C, #8B4513)',
    color: 'white',
    fontSize: '26px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    boxShadow: '0 6px 20px rgba(200, 149, 108, 0.5)',
  },
  infoBtn: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: '2px solid #C8956C',
    background: 'white',
    color: '#C8956C',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counter: {
    fontSize: '13px',
    color: '#8B6355',
    fontFamily: "'DM Sans', sans-serif",
    textAlign: 'center',
  },
  empty: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  emptyTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '26px',
    color: '#2C1810',
    marginBottom: '12px',
  },
  emptyText: {
    color: '#8B6355',
    marginBottom: '24px',
    lineHeight: '1.6',
  },
  resetBtn: {
    background: 'linear-gradient(135deg, #C8956C, #8B4513)',
    color: 'white',
    border: 'none',
    padding: '12px 28px',
    borderRadius: '30px',
    fontSize: '15px',
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
    fontWeight: '500',
  }
};

export default function SwipeDeck({ cafes, onSwipeComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedCount, setLikedCount] = useState(0);

  function handleSwipe(direction, cafe) {
    const matchId = cafe.matchId || cafe.id;
    saveSwipe(matchId, direction);

    if (direction === 'right') {
      setLikedCount(prev => prev + 1);
    }

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);

    // Notify parent when at least 3 cafes liked or deck is done
    if (direction === 'right' && likedCount + 1 >= 3) {
      onSwipeComplete?.();
    }
    if (nextIndex >= cafes.length) {
      onSwipeComplete?.();
    }
  }

  function handleButtonSwipe(direction) {
    if (currentIndex >= cafes.length) return;
    handleSwipe(direction, cafes[currentIndex]);
  }

  function handleReset() {
    setCurrentIndex(0);
    setLikedCount(0);
  }

  const remaining = cafes.length - currentIndex;
  const isDone = currentIndex >= cafes.length;

  if (isDone) {
    return (
      <div style={styles.empty}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>☕</div>
        <div style={styles.emptyTitle}>You've rated all {cafes.length} spots!</div>
        <p style={styles.emptyText}>
          You loved {likedCount} cafe{likedCount !== 1 ? 's' : ''}.<br />
          Head to Matches to see who you're aligned with.
        </p>
        <button style={styles.resetBtn} onClick={handleReset}>
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.deckWrapper}>
        {/* Background shadow cards */}
        {currentIndex + 2 < cafes.length && <div style={styles.backgroundCard2} />}
        {currentIndex + 1 < cafes.length && <div style={styles.backgroundCard} />}

        {/* Top card */}
        <AnimatePresence>
          {!isDone && (
            <CafeCard
              key={cafes[currentIndex].id}
              cafe={cafes[currentIndex]}
              onSwipe={handleSwipe}
              isTop={true}
            />
          )}
        </AnimatePresence>
      </div>

      <div style={styles.counter}>
        {remaining} cafe{remaining !== 1 ? 's' : ''} left · ❤️ {likedCount} liked
      </div>

      <div style={styles.buttons}>
        <motion.button
          style={styles.passBtn}
          whileHover={{ scale: 1.1, boxShadow: '0 6px 20px rgba(239, 83, 80, 0.35)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleButtonSwipe('left')}
          title="Pass"
        >
          ✕
        </motion.button>

        <motion.button
          style={styles.likeBtn}
          whileHover={{ scale: 1.1, boxShadow: '0 8px 28px rgba(200, 149, 108, 0.65)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleButtonSwipe('right')}
          title="Love it!"
        >
          ☕
        </motion.button>
      </div>

      <div style={{ fontSize: '12px', color: '#B8A090', textAlign: 'center' }}>
        Swipe right to like · Swipe left to pass
      </div>
    </div>
  );
}