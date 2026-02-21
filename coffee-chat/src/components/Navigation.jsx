import React from 'react';
import { motion } from 'framer-motion';

const styles = {
  nav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(250, 247, 242, 0.95)',
    backdropFilter: 'blur(10px)',
    borderTop: '1px solid rgba(200, 149, 108, 0.2)',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '10px 0 16px',
    zIndex: 100,
  },
  tab: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
    padding: '6px 20px',
    borderRadius: '12px',
    border: 'none',
    background: 'transparent',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'all 0.2s',
  },
  icon: {
    fontSize: '22px',
    lineHeight: 1,
  },
  label: (active) => ({
    fontSize: '11px',
    fontWeight: active ? '600' : '400',
    color: active ? '#C8956C' : '#B8A090',
    letterSpacing: '0.3px',
  }),
  indicator: {
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    background: '#C8956C',
  },
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    background: 'rgba(250, 247, 242, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(200, 149, 108, 0.15)',
    padding: '16px 20px 12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 100,
  },
  logo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '22px',
    fontWeight: '700',
    color: '#2C1810',
    letterSpacing: '-0.5px',
  },
  logoDot: {
    color: '#C8956C',
  },
  subtitle: {
    fontSize: '11px',
    color: '#8B6355',
    fontWeight: '400',
  }
};

const tabs = [
  { id: 'swipe', icon: '☕', label: 'Discover' },
  { id: 'map',   icon: '🗺️', label: 'Map' },
  { id: 'matches', icon: '✨', label: 'Matches' },
];

export default function Navigation({ activeTab, onTabChange, matchCount }) {
  return (
    <>
      <div style={styles.header}>
        <div>
          <div style={styles.logo}>
            Brew<span style={styles.logoDot}>Meet</span>
          </div>
          <div style={styles.subtitle}>Coffee · Connection · Community</div>
        </div>
        {matchCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              background: 'linear-gradient(135deg, #C8956C, #8B4513)',
              color: 'white',
              borderRadius: '20px',
              padding: '4px 14px',
              fontSize: '13px',
              fontWeight: '600',
            }}
          >
            {matchCount} match{matchCount !== 1 ? 'es' : ''}
          </motion.div>
        )}
      </div>

      <nav style={styles.nav}>
        {tabs.map(tab => (
          <motion.button
            key={tab.id}
            style={styles.tab}
            whileTap={{ scale: 0.9 }}
            onClick={() => onTabChange(tab.id)}
          >
            <span style={styles.icon}>{tab.icon}</span>
            <span style={styles.label(activeTab === tab.id)}>{tab.label}</span>
            {activeTab === tab.id && <div style={styles.indicator} />}
          </motion.button>
        ))}
      </nav>
    </>
  );
}