import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const styles = {
  card: {
    position: 'absolute',
    width: '100%',
    maxWidth: '360px',
    height: '520px',
    borderRadius: '24px',
    overflow: 'hidden',
    cursor: 'grab',
    userSelect: 'none',
    boxShadow: '0 20px 60px rgba(44, 24, 16, 0.18)',
    background: '#FAF7F2',
  },
  image: {
    width: '100%',
    height: '280px',
    objectFit: 'cover',
    pointerEvents: 'none',
  },
  content: {
    padding: '20px',
  },
  name: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '22px',
    fontWeight: '700',
    color: '#2C1810',
    marginBottom: '4px',
  },
  address: {
    fontSize: '13px',
    color: '#8B6355',
    marginBottom: '10px',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  stars: {
    color: '#C8956C',
    fontSize: '15px',
    fontWeight: '600',
  },
  reviewCount: {
    fontSize: '12px',
    color: '#8B6355',
  },
  priceLevel: {
    fontSize: '13px',
    color: '#4A2C20',
    fontWeight: '500',
    background: 'rgba(200, 149, 108, 0.15)',
    padding: '2px 8px',
    borderRadius: '20px',
  },
  tagRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '10px',
  },
  tag: {
    fontSize: '11px',
    background: 'rgba(44, 24, 16, 0.07)',
    color: '#4A2C20',
    padding: '3px 10px',
    borderRadius: '20px',
    fontWeight: '500',
  },
  description: {
    fontSize: '13px',
    color: '#6B4F44',
    lineHeight: '1.5',
  },
  likeLabel: {
    position: 'absolute',
    top: '30px',
    left: '20px',
    background: '#4CAF50',
    color: 'white',
    fontFamily: "'Playfair Display', serif",
    fontSize: '28px',
    fontWeight: '700',
    padding: '6px 16px',
    borderRadius: '8px',
    border: '3px solid #4CAF50',
    transform: 'rotate(-12deg)',
    letterSpacing: '2px',
    pointerEvents: 'none',
  },
  nopeLabel: {
    position: 'absolute',
    top: '30px',
    right: '20px',
    background: '#ef5350',
    color: 'white',
    fontFamily: "'Playfair Display', serif",
    fontSize: '28px',
    fontWeight: '700',
    padding: '6px 16px',
    borderRadius: '8px',
    border: '3px solid #ef5350',
    transform: 'rotate(12deg)',
    letterSpacing: '2px',
    pointerEvents: 'none',
  },
};

export default function CafeCard({ cafe, onSwipe, isTop }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const likeOpacity = useTransform(x, [0, 80], [0, 1]);
  const nopeOpacity = useTransform(x, [-80, 0], [1, 0]);

  async function handleDragEnd(event, info) {
    const threshold = 120;
    if (info.offset.x > threshold) {
      await animate(x, 600, { duration: 0.3 });
      onSwipe('right', cafe);
    } else if (info.offset.x < -threshold) {
      await animate(x, -600, { duration: 0.3 });
      onSwipe('left', cafe);
    } else {
      animate(x, 0, { type: 'spring', stiffness: 300, damping: 20 });
    }
  }

  function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - (half ? 1 : 0));
  }

  return (
    <motion.div
      style={{ ...styles.card, x, rotate, zIndex: isTop ? 10 : 5 }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={isTop ? { cursor: 'grabbing' } : {}}
    >
      <img src={cafe.image} alt={cafe.name} style={styles.image} draggable={false} />
      <div style={styles.content}>
        <div style={styles.name}>{cafe.name}</div>
        <div style={styles.address}>{cafe.address}</div>
        <div style={styles.ratingRow}>
          <span style={styles.stars}>{renderStars(parseFloat(cafe.rating))}</span>
          <span style={styles.reviewCount}>({cafe.reviewCount} reviews)</span>
          <span style={styles.priceLevel}>{cafe.priceLevel}</span>
        </div>
        <div style={styles.tagRow}>
          {cafe.tags.slice(0, 4).map(tag => (
            <span key={tag} style={styles.tag}>{tag}</span>
          ))}
        </div>
        <p style={styles.description}>{cafe.description}</p>
      </div>

      {/* LIKE / NOPE overlays */}
      {isTop && (
        <>
          <motion.div style={{ ...styles.likeLabel, opacity: likeOpacity }}>
            BREW IT ☕
          </motion.div>
          <motion.div style={{ ...styles.nopeLabel, opacity: nopeOpacity }}>
            PASS
          </motion.div>
        </>
      )}
    </motion.div>
  );
}